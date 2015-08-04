/********
 * Init *
 ********/

/*
 * Global variables
 */

// populated from get parameter on URL during init
var gvUserId;

 // Logging control
 var gvLogErrors = true;
 var gvLogProcs  = true;
 var gvLogDebugs = true;
 var gvLogInfos  = false;
 var gvLogLstnrs = false;
 var gvLogTemps  = true;


/*
 *
 */
(function initialise(){

    log('addNewRec.initialise: Start','PROCS');

    window.addEventListener('DOMContentLoaded', DOMContentLoadedListener);

    var params = getSearchParameters();
    gvUserId = params.userId;

})();

/*
 * Decode get parameter to get userId
 */
 function getSearchParameters() {
       var prmstr = window.location.search.substr(1);
       return prmstr !== null && prmstr !== "" ? transformToAssocArray(prmstr) : {};
 }

 function transformToAssocArray( prmstr ) {
     var params = {};
     var prmarr = prmstr.split("&");
     for ( var i = 0; i < prmarr.length; i++) {
         var tmparr = prmarr[i].split("=");
         params[tmparr[0]] = tmparr[1];
     }
     return params;
 }

/**********************
 * Listener Functions *
 **********************/

/*
 *
 */
function DOMContentLoadedListener(){

    log('addNewRec.DOMContentLoadedListener: Start','LSTNR');

    var thisURL = window.location.pathname;

    if (thisURL.indexOf('addNewRecommendation.html') != -1) {
        displayPage(getAddNewRecFormHTML());
    }
}

/******************
 * HTML Functions *
 ******************/

/*
 *
 */

function displayPage(contentHTML) {

   log("addNewRec.displayPage: Start",'PROCS');

   var htmlString = '';

   //htmlString += getNavBarHTML();
   htmlString += '<br />';
   htmlString += '<br />';
   htmlString += contentHTML;

   document.getElementById('container').innerHTML = htmlString;

 }

/*
 *
 */
function getAddNewRecFormHTML(thankYouText) {

    log('addNewRec.getAddNewRecFormHTML: Start','PROCS');

    var htmlString = '';

    if(thankYouText) {
        htmlString += '<div class="row">';
        htmlString += '  <div class="small-10 small-offset-1 columns end">';
        htmlString += '    <h6>' + thankYouText + '</h6>';
        htmlString += '  </div>';
        htmlString += '</div>';
        htmlString += '<hr />';

    }
    htmlString += '<form action="javascript:addNewRec();">';
    htmlString += '  <div class="row">';
    htmlString += '    <div class="small-8 columns">';
    htmlString += '      <h3 class="subheader">Share your favourite products!</h3>';
    htmlString += '    </div>';
    htmlString += '    <div class="small-4 columns">';
    htmlString += '      <input type="submit" value="Submit" class="button radius tiny right" />';
    htmlString += '    </div>';
    htmlString += '  </div>';
    htmlString += '  <div class="row">';
    htmlString += '    <div class="small-12 columns">';
    htmlString += '      <label>Tell us the name of a great product or brand';
    htmlString += '        <input required type="text" id="fieldProductName_addRec" placeholder="Product name" />';
    htmlString += '      </label>';
    htmlString += '    </div>';
    htmlString += '  </div>';
    htmlString += '  <div class="row">';
    htmlString += '    <div class="small-12 columns">';
    htmlString += '      <label>Do you know the company\'s website or Twitter username  ?';
    htmlString += '        <input type="text" id="fieldURLorTwitter_addRec" placeholder="Website or Twitter" />';
    htmlString += '      </label>';
    htmlString += '    </div>';
    htmlString += '  </div>';
    htmlString += '  <div class="row">';
    htmlString += '    <div class="small-12 columns">';
    htmlString += '      <label>Tell us why you think this product is so awesome (optional)';
    htmlString += '        <textarea id="fieldWhy_addRec" placeholder="This product is a great ethical alternative to...' + String.fromCharCode(10) + String.fromCharCode(10) + 'Because..." rows="6"></textarea>';
    htmlString += '      </label>';
    htmlString += '    </div>';
    htmlString += '  </div>';
    htmlString += '</form>';

    return htmlString;
}

/******************
 * Data Functions *
 ******************/

/*
 *
 */
function addNewRec() {

    log('addNewRec.addNewRec: Start','PROCS');

    var fieldProductName  = document.getElementById("fieldProductName_addRec");
    var fieldURLOrTwitter = document.getElementById("fieldURLorTwitter_addRec");
    var fieldWhy          = document.getElementById("fieldWhy_addRec");

    var productName  = fieldProductName.value;
    var URLOrTwitter = fieldURLOrTwitter.value;
    var why          = fieldWhy.value;

    Parse.initialize("mmhyD9DKGeOanjpRLHCR3bX8snue22oOd3NGfWKu", "IRfKgjMWYJqaHhgK3AUFNu2KsXrNnorzRZX1hmuY");

    var userQuery = new Parse.Query(Parse.User);
    userQuery.get(gvUserId,{
        success: function(user) {

            var UserSubmittedRec = Parse.Object.extend("UserSubmittedRec");
            var userSubmittedRec = new UserSubmittedRec({ACL: new Parse.ACL(user)});

            userSubmittedRec.set('user',user);
            userSubmittedRec.set('productName',productName);
            userSubmittedRec.set('URLOrTwitter',URLOrTwitter);
            userSubmittedRec.set('why',why);

            userSubmittedRec.save(null,{
                success: function(userSubmittedRec){
                    displayPage(getAddNewRecFormHTML('Thank You! <br /><br />Balu relies on everybody helping each other. So we really appreciate your contribution. Keep them coming!<br /><br />You\'ll see your recommendation in the Balu sidebar just as soon as we can add it to the database.<br /><br />Got any more great products you want to share with the world...?'));
                },
                error: parseError
            });
        },
        error: parseError
    });
}

/**************************
 * Error and Log handling *
 **************************/

 /*
  *
  */

  function log(message, levelP) {

      var level = levelP || 'NOTHING PASSED';

      switch(level) {
         case 'ERROR':
             if (gvLogErrors) console.log(level + ': ' + message);
             break;
         case 'PROCS':
             if (gvLogProcs)  console.log(level + ': ' + message);
             break;
         case 'DEBUG':
             if (gvLogDebugs) console.log(level + ': ' + message);
             break;
         case ' INFO':
             if (gvLogInfos) console.log(level + ': ' + message);
             break;
         case 'LSTNR':
             if (gvLogLstnrs) console.log(level + ': ' + message);
             break;
         case ' TEMP':
             if (gvLogTemps) console.log(level + ': ' + message);
             break;
         default:
             console.log('UNKWN' + ': ' + message);
     }
}


function parseError(result, error) {
    alert("Error: " + error.code + " " + error.message);
}
