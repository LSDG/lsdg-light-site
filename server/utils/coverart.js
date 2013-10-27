//----------------------------------------------------------------------------------------------------------------------
// Gets cover art from AWS, based on the current song.
//
// @module coverart.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAJSZDJO7JRD2GR2EQ',
    awsSecret: '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',
    assocId:   'lschli-20'
});

//----------------------------------------------------------------------------------------------------------------------

function queryAWSForCoverArt(query, callback)
{
    opHelper.execute('ItemSearch', {
        'SearchIndex': 'DigitalMusic',
        'Keywords': query,
        'ResponseGroup': 'Images'
    }, function(results)
    {
        //TODO: This needs to be made more robust!
        if(results.ItemSearchResponse.Items.length > 0)
        {
            callback({
                small: results.ItemSearchResponse.Items[0].Item[0].SmallImage[0].URL[0],
                medium: results.ItemSearchResponse.Items[0].Item[0].MediumImage[0].URL[0],
                large: results.ItemSearchResponse.Items[0].Item[0].LargeImage[0].URL[0]
            });
        } // end if

        callback('');
    });
} // end queryAWSForCoverArt

function getCoverArt(artist, album, callback)
{
    queryAWSForCoverArt(artist + " - " + album, callback);
} // end get CoverArt

module.exports = {
    queryAWSForCoverArt: queryAWSForCoverArt,
    getCoverArt: getCoverArt
}; // end exports

//----------------------------------------------------------------------------------------------------------------------