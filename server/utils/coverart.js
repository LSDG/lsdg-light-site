//----------------------------------------------------------------------------------------------------------------------
// Gets cover art from AWS, based on the current song.
//
// @module coverart.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');
OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAJMNPDKJBDXNXIWGQ',
    awsSecret: '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',
    assocId:   'lls019-20'
});

//----------------------------------------------------------------------------------------------------------------------

function queryAWSForCoverArt(query, callback)
{
    opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': query,
        'ResponseGroup': 'Images'
    }, function(results)
    {
        if(results.ItemSearchResponse && results.ItemSearchResponse.Items.length > 0)
        {
            var item = results.ItemSearchResponse.Items[0];
            var results = undefined;

            if(parseInt(item.TotalResults) > 0)
            {
                results = {
                    small: item.Item[0].SmallImage[0].URL[0],
                    medium: item.Item[0].MediumImage[0].URL[0],
                    large: item.Item[0].LargeImage[0].URL[0]
                };

                callback(results);
            }
            else
            {
                console.error('Failed to find albumn art for:', query);
                callback({
                    small: "http://s.pixogs.com/images/record150.png",
                    medium: "http://s.pixogs.com/images/record150.png",
                    large: "http://s.pixogs.com/images/record150.png"
                });
            } // end if
        }
        else
        {
            callback();
        } // end if
    });
} // end queryAWSForCoverArt

function getCoverArt(artist, title, callback)
{
    queryAWSForCoverArt(artist + " - " + title, callback);
} // end get CoverArt

module.exports = {
    queryAWSForCoverArt: queryAWSForCoverArt,
    getCoverArt: getCoverArt
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
