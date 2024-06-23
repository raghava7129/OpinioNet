// const { translate } = require('@vitalets/google-translate-api');
// const NodeCache = require('node-cache');
// const myCache = new NodeCache({ stdTTL: 600 }); // cache for 10 minutes

// const TranslateController = async (req, res) => {
//     const { text, targetLanguage } = req.body;
//     const cacheKey = `${text}-${targetLanguage}`;

//     const cachedTranslation = myCache.get(cacheKey);
//     if (cachedTranslation) {
//         return res.json({
//             translatedText: cachedTranslation,
//         });
//     }

//     try {
//         const result = await translate(text, { to: targetLanguage });
//         console.log(result.text);

//         myCache.set(cacheKey, result.text);
//         res.json({
//             translatedText: result.text,
//         });
//     } catch (err) {
//         console.error("Translation error: ", err);
//         res.status(400).json({ error: "Translation error", details: err.message });
//     }
// };

// module.exports = { TranslateController };
require('dotenv').config();

const {Translate} = require('@google-cloud/translate').v2;
const CREDENTIALS = JSON.parse(process.env.GOOGLE_TRANSLATE_CREDENTIALS);
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600 });

const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const TranslateController = async (req, res) => {
    const { text, targetLanguage } = req.body;
    const cacheKey = `${text}-${targetLanguage}`;

    const cachedTranslation = myCache.get(cacheKey);
    if (cachedTranslation) {
        return res.json({
            translatedText: cachedTranslation,
        });
    }

    try {
        const [translation] = await translate.translate(text, targetLanguage);
        console.log(translation);

        myCache.set(cacheKey, translation);
        res.json({
            translatedText: translation,
        });
    } catch (err) {
        console.error("Translation error: ", err);
        res.status(400).json({ error: "Translation error", details: err.message });
    }
};

module.exports = { TranslateController };
