const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cheerio = require('cheerio')
const axios = require('axios')
const {
    google,
} = require('googleapis')

// For development
const dotenv =
    require('dotenv').config()
// const keys = require('../sailing-pairs/')

//Import pairs datastructure model
const Pairs = require('./models/Pairs')
const PairsBackup = require('./models/PairsBackup')
const PairsOfficial = require('./models/PairsOfficial')

// enable express && cors
const app =
    express()
app.use(
    cors()
)
app.use(
    express.json()
)

// selects port if available || uses 3000
const port =
    process
        .env
        .PORT ||
    3000

// Connect to database
mongoose.connect(
    process
        .env
        .DATABASE_URL,
    {
        useNewUrlParser: true,
    }
)
const db =
    mongoose.connection
db.once(
    'open',
    () =>
        app.listen(
            port,
            () =>
                console.log(
                    `Starting server at ${port}`
                )
        )
) //start server
db.on(
    'error',
    (
        error
    ) =>
        console.log(
            error
        )
)

const client =
    new google.auth.JWT(
        process.env.client_email,
        null,
        process.env.private_key,
        [
            'https://www.googleapis.com/auth/spreadsheets',
        ]
    )

client.authorize(
    function (
        err,
        tokens
    ) {
        if (
            err
        ) {
            console.log(
                err
            )
            return
        } else {
            console.log(
                'Connected'
            )
        }
    }
)

async function gsrun(
    cl,
    range
) {
    const gsapi =
        google.sheets(
            {
                version:
                    'v4',
                auth: cl,
            }
        )

    var opt =
        {
            spreadsheetId:
                '1B56mAoBHFct_xcUB9ZWt-GHA1s2Kmbmc_LiiyABxlpY',
            range: range,
            majorDimension:
                'COLUMNS',
        }

    let data =
        await gsapi.spreadsheets.values.get(
            opt
        )
    return data
        .data
        .values
}

async function test() {
    console.log(
        await getData(
            'points',
            'Barrett',
            undefined,
            undefined,
            undefined,
            undefined,
            'SSP'
        )
    )
    // console.log(await gsrun(client, "'scores'!H4:H46"));
}

// Handle post request for creating a saved pairing list
app.post(
    '/pairs',
    async (
        req,
        res
    ) => {
        // console.log(req.body);

        var pairs =
            req.body
        if (
            req
                .body
                .name
                .length <
            30
        ) {
            const saverPairs =
                new Pairs(
                    pairs
                )
            const saverPairs2 =
                new PairsBackup(
                    pairs
                )
            await saverPairs.save()
            await saverPairs2.save()
        }

        res.json(
            {
                status: 'sucess',
                pairs: req.body,
            }
        )
        console.log(
            'Pairs saved'
        )
    }
)

// Handle post request for creating a saved pairing list
app.post(
    '/pairsOfficial',
    async (
        req,
        res
    ) => {
        // console.log(req.body);

        var pairs =
            req.body
        if (
            req
                .body
                .name
                .length <
            30
        ) {
            const saverPairs =
                new PairsOfficial(
                    pairs
                )
            const saverPairs2 =
                new PairsBackup(
                    pairs
                )
            await saverPairs.save()
            await saverPairs2.save()
        }

        res.json(
            {
                status: 'sucess',
                pairs: req.body,
            }
        )
        console.log(
            'Pairs saved'
        )
    }
)
// Handle request all saved official pairs
app.post(
    '/getPairsOfficial',
    async (
        req,
        res
    ) => {
        PairsOfficial.find(
            {
                season: req
                    .body
                    .season,
            },
            async function (
                err,
                docs
            ) {
                // console.log(docs);
                console.log(
                    'pairs gotten'
                )
                res.json(
                    {
                        pairs: docs,
                    }
                )
            }
        )
    }
)
// Handle request one saved official pair
app.post(
    '/getPairsOfficialOne',
    async (
        req,
        res
    ) => {
        if (
            req
                .body
                .name !=
            ''
        ) {
            PairsOfficial.findOne(
                {
                    name: req
                        .body
                        .name,
                    season: req
                        .body
                        .season,
                },
                async function (
                    err,
                    docs
                ) {
                    // console.log(docs);
                    console.log(
                        'pairs gotten'
                    )
                    res.json(
                        {
                            pairs: docs,
                        }
                    )
                }
            )
        }
    }
)

// Handle request single saved pairing list
app.post(
    '/getPairs',
    async (
        req,
        res
    ) => {
        if (
            req
                .body
                .name !=
            ''
        ) {
            Pairs.findOne(
                {
                    name: req
                        .body
                        .name,
                },
                async function (
                    err,
                    docs
                ) {
                    // console.log(docs);
                    console.log(
                        'pairs gotten'
                    )
                    res.json(
                        {
                            pairs: docs,
                        }
                    )
                }
            )
        }
    }
)

//Handle request for updated saved pairs
app.post(
    '/getNames',
    async (
        req,
        res
    ) => {
        Pairs.find(
            {},
            async function (
                err,
                docs
            ) {
                // console.log(await docs);
                console.log(
                    'Names gotten'
                )
                res.json(
                    {
                        pairs: docs,
                    }
                )
            }
        )
    }
)

// Handle request for deletion of a pair list
app.post(
    '/delPair',
    async (
        req,
        res
    ) => {
        Pairs.deleteOne(
            {
                name: req
                    .body
                    .name,
            },
            function (
                err,
                docs
            ) {
                res.json(
                    {
                        status: 'sucess',
                    }
                )
            }
        )
    }
)

app.post(
    '/scores',
    async (
        req,
        res
    ) => {
        // console.log(req.body);
        res.json(
            {
                body: getData(
                    req
                        .body
                        .type,
                    req
                        .body
                        .name,
                    req
                        .body
                        .fleet,
                    req
                        .body
                        .division,
                    req
                        .body
                        .position,
                    req
                        .body
                        .pair,
                    req
                        .body
                        .regatta
                ),
                labels: venues,
            }
        )
    }
)
