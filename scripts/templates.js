define(['jade'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }

this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/dashboard/dashboardEmptyFavoritesTemplate"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"dashboard-profile\"><div class=\"profile-left\">");
var profileImgUrl="images/placeholder_imgs/profile_placeholder.png"
buf.push("<div" + (jade.attrs({ 'style':("background:url('" + profileImgUrl + "')"), "class": [('profile-image')] }, {"style":true})) + "></div><div class=\"message\"><br/><br/>No profiles saved as favorites.<br/><br/>View profiles and click the save favorite icon to build your list of favorites.</div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/dashboard/dashboardFavoriteTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,profileId = locals_.profileId;buf.push("<div class=\"row favorite-panel\">");
var profileImgUrl = "images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
profileImgUrl = profile.profilePictureUrl
}
buf.push("<div class=\"col-xs-7 col-sm-3 col-md-3 col-lg-3\"><div class=\"profile-image-box\"><div" + (jade.attrs({ 'style':("background:url('" + profileImgUrl +"')"), 'data-profileid':(profileId), "class": [('profile-image-container')] }, {"style":true,"data-profileid":true})) + "></div></div></div><div class=\"visible-xs col-xs-5\"><br/><div class=\"profile-title text-right\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</div><br/></div><div class=\"col-xs-12 col-sm-8 col-md-8 col-lg-8\"><div class=\"content\"><div class=\"hidden-xs profile-title\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "&nbsp;<span class=\"orgs\">");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications)
{
// iterate profile.certifications
;(function(){
  var $$obj = profile.certifications;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var val = $$obj[index];

buf.push(jade.escape(null == (jade.interp = val) ? "" : jade.interp));
if ( index < profile.certifications.length -1)
{
buf.push(jade.escape(null == (jade.interp = '/') ? "" : jade.interp));
}
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var val = $$obj[index];

buf.push(jade.escape(null == (jade.interp = val) ? "" : jade.interp));
if ( index < profile.certifications.length -1)
{
buf.push(jade.escape(null == (jade.interp = '/') ? "" : jade.interp));
}
    }

  }
}).call(this);

}
}
else
{
if ( profile.organizations)
{
for (var x = 0; x < profile.organizations.length; x++)
{
if ( x == profile.organizations.length - 1)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x] + "/") ? "" : jade.interp));
}
}
}
}
buf.push("</span></div><div class=\"subtitle\">");
if ( profile.profileType == 'venue')
{
buf.push("<div class=\"heading\">Venue Type:</div>");
}
else if ( profile.profileType == 'business')
{
buf.push("<div class=\"heading\">Services:</div>");
}
else
{
buf.push("<div class=\"heading\">Skills:</div>");
}
if ( profile.skills)
{
for (var x = 0; x < profile.skills.length; x++)
{
if ( x == profile.skills.length - 1)
{
if ( profile.skills[x])
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType) ? "" : jade.interp));
}
}
else
{
if ( profile.skills[x])
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType + ", ") ? "" : jade.interp));
}
}
}
}
buf.push("</div><div class=\"subtitle\"><div class=\"heading\">Tags:</div>");
if ( profile.tags)
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( x == profile.tags.length - 1)
{
if ( profile.tags[x])
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
}
else
{
if ( profile.tags[x])
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
}
}
buf.push("</div><div class=\"profile-location subtitle\"><div class=\"heading\">Location:</div>");
if ( profile.location)
{
buf.push(jade.escape(null == (jade.interp = profile.location) ? "" : jade.interp));
}
buf.push("</div><div class=\"bottom-buttons\"><input" + (jade.attrs({ 'type':("button"), 'value':("View Profile"), 'data-profileid':(profileId), "class": [('viewFavProfile'),('button-red')] }, {"type":true,"value":true,"data-profileid":true})) + "/><input" + (jade.attrs({ 'id':('removeFavorite'), 'type':("button"), 'value':("Remove"), 'data-profileid':(profileId), "class": [('sub-nav-button'),('button-link')] }, {"type":true,"value":true,"data-profileid":true})) + "/></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/dashboard/dashboardMasterViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),user = locals_.user;buf.push("<div class=\"dashboard-greeting-area\"><div class=\"dashboard-name\">Hello,&nbsp;");
if ( (user.get("firstName")))
{
buf.push(jade.escape(null == (jade.interp = user.get("firstName")) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = user.firstName) ? "" : jade.interp));
}
buf.push("</div><div class=\"profile-header-buttons\"><input id=\"my-profiles\" type=\"button\" value=\"My Profiles\" class=\"button-link active\"/><input id=\"my-favorites\" type=\"button\" value=\"My Favorites\" class=\"button-link\"/><input id=\"add-new-profile\" type=\"button\" value=\"Add Profile +\" class=\"hidden button-link right\"/></div><div id=\"profile-delete-modal\" class=\"popover\"><span class=\"confirm-delete-subtitle\">Are you sure you want to delete this profile?</span><br/><input type=\"button\" id=\"delete-profile-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"profile-delete-modal\" class=\"confirm-delete-button close-modal\"/></div></div><div class=\"dashboard-profile-area\"></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/dashboard/dashboardNewProfileTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),Mi = locals_.Mi;buf.push("<div class=\"registration-page-3\"><div class=\"add-new-profile\"><h1>Select your profile type</h1><div class=\"profile-selection-container\"><div class=\"profile-selection-buttons\"><button id=\"select-3d-printing\" data-profiletype=\"_3d_printing\" class=\"profile-button selected-profile\">3D Printing</button><button id=\"select-injection-molding\" data-profiletype=\"injection_molding\" class=\"profile-button\">Injection Molding</button><button id=\"select-metal-die-casting\" data-profiletype=\"metal_die_casting\" class=\"profile-button\">Metal Die Casting</button><button id=\"select-cnc-machining\" data-profiletype=\"cnc_machining\" class=\"profile-button\">CNC Machining</button><button id=\"select-other\" data-profiletype=\"other\" class=\"profile-button\">Other Services</button></div>");
// iterate Mi.CMS.profile_desc
;(function(){
  var $$obj = Mi.CMS.profile_desc;
  if ('number' == typeof $$obj.length) {

    for (var val = 0, $$l = $$obj.length; val < $$l; val++) {
      var index = $$obj[val];

buf.push("<div" + (jade.attrs({ 'id':(val+"-desc"), "class": [('profile-selection-desc')] }, {"id":true})) + ">" + (jade.escape(null == (jade.interp = index) ? "" : jade.interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var val in $$obj) {
      $$l++;      var index = $$obj[val];

buf.push("<div" + (jade.attrs({ 'id':(val+"-desc"), "class": [('profile-selection-desc')] }, {"id":true})) + ">" + (jade.escape(null == (jade.interp = index) ? "" : jade.interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div><div class=\"continue-button-section\"><span class=\"red-text\">You can add another profile type later</span><input type=\"button\" id=\"create-new-profile\" value=\"Continue &gt;&gt;\"/></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/dashboard/dashboardProfileViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profileId = locals_.profileId,profile = locals_.profile;buf.push("<div" + (jade.attrs({ 'id':("profile-summary-"+profileId), "class": [('profile-left')] }, {"id":true})) + ">");
var profileImgUrl="images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
profileImgUrl=profile.profilePictureUrl
}
buf.push("<div" + (jade.attrs({ 'style':("background:url('" + profileImgUrl + "')"), "class": [('profile-image')] }, {"style":true})) + "></div><div class=\"profile-detail\"><div class=\"profile-left-title\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</div><div class=\"profile-type\">" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</div><br/><div class=\"profile-skills\">");
if ( (profile.skills))
{
for (var x = 0; x < profile.skills.length; x++)
{
if ( (x == profile.skills.length - 1))
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType + ", ") ? "" : jade.interp));
}
}
}
buf.push("</div></div></div><div class=\"profile-sub-nav\"><a" + (jade.attrs({ 'href':("#/edit-profile/"+profileId), "class": [('sub-nav-button'),('edit-profile'),('hidden-sm'),('hidden-xs')] }, {"href":true})) + ">Edit Profile</a><a" + (jade.attrs({ 'href':("#/display-profile/"+profileId), 'data-profiletype':(profile.profileType), 'data-profileid':(profileId), "class": [('sub-nav-button')] }, {"href":true,"data-profiletype":true,"data-profileid":true})) + ">View Profile</a><a" + (jade.attrs({ 'data-profiletype':(profile.profileType), 'data-profileid':(profileId), "class": [('sub-nav-button'),('hidden-sm'),('hidden-xs'),('sub-nav-delete')] }, {"data-profiletype":true,"data-profileid":true})) + ">Delete Profile</a></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/dev/loginLayer"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"login-layer\"><div class=\"login-section\"><br/><input type=\"password\" placeholder=\"password\" id=\"login-layer-pass\" style=\"width:100%\" class=\"primary-input\"/><br/><br/><br/><br/><div style=\"float:right\"><input type=\"button\" value=\"Submit\" id=\"login\" class=\"search-button button \"/></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/email/profile_created"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profileUrl = locals_.profileUrl,profileId = locals_.profileId,profile = locals_.profile;buf.push("<h3>A new profile has been CREATED!</h3><br/><h3>View profile: &nbsp;");
profileUrl="http://www.across-mold.com/#/display-profile/" + profileId
buf.push("<a" + (jade.attrs({ 'href':([profileUrl]) }, {"href":true})) + ">" + (jade.escape(null == (jade.interp = profileUrl) ? "" : jade.interp)) + "</a></h3><br/><p>Name: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</p><p>Email: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileContactEmail) ? "" : jade.interp)) + "</p><p>Profile Type: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</p><p>Tags: &nbsp;");
if ( profile.tags && profile.tags.length > 0)
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( (x == profile.tags.length - 1))
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
}
buf.push("</p><p>");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications.length == 0)
{
buf.push("Certifications");
for (var x = 0; x < profile.certifications.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.certifications[x]) ? "" : jade.interp));
if ( (x < profile.certifications.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
else
{
if ( profile.organizations && profile.organizations.length == 0)
{
buf.push("Equity/Union");
for (var x = 0; x < profile.organizations.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
if ( (x < profile.organizations.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
buf.push("</p><p>Profile Type: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</p><p>Published: &nbsp;");
if ( profile.profilePublished)
{
buf.push("Published");
}
else
{
buf.push("Private");
}
buf.push("</p>");;return buf.join("");
};

this["JST"]["app/scripts/templates/email/profile_published"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profileUrl = locals_.profileUrl,profileId = locals_.profileId,profile = locals_.profile;buf.push("<h3>A profile has been PUBLISHED!</h3><br/><h3>View profile: &nbsp;");
profileUrl="http://www.across-mold.com/#/display-profile/" + profileId
buf.push("<a" + (jade.attrs({ 'href':([profileUrl]) }, {"href":true})) + ">" + (jade.escape(null == (jade.interp = profileUrl) ? "" : jade.interp)) + "</a></h3><br/><p>Name: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</p><p>Email: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileContactEmail) ? "" : jade.interp)) + "</p><p>Profile Type: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</p><p>Custom URL: &nbsp;");
if ( profile.profileCustomUrl)
{
buf.push(jade.escape(null == (jade.interp = "http://www.across-mold.com/#/" + profile.profileCustomUrl) ? "" : jade.interp));
}
buf.push("</p><p>Tags: &nbsp;");
if ( profile.tags && profile.tags.length > 0)
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( (x == profile.tags.length - 1))
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
}
buf.push("</p><p>");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications.length == 0)
{
buf.push("Certifications");
for (var x = 0; x < profile.certifications.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.certifications[x]) ? "" : jade.interp));
if ( (x < profile.certifications.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
else
{
if ( profile.organizations && profile.organizations.length == 0)
{
buf.push("Equity/Union");
for (var x = 0; x < profile.organizations.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
if ( (x < profile.organizations.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
buf.push("</p><p>Profile Type: &nbsp;" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</p><p>Published: &nbsp;");
if ( profile.profilePublished)
{
buf.push("Published");
}
else
{
buf.push("Private");
}
buf.push("</p>");;return buf.join("");
};

this["JST"]["app/scripts/templates/footer"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"footer-container container\"><div class=\"footer-links\"><div class=\"right hidden-xs\">©2015 Across Mold Industrial Limited </div><div class=\"right\">Contact Us<!--a(href=\"#/microsite/contactus\") Contact Us--></div><div class=\"right\">FAQ<!--a(href=\"#/microsite/faq\") FAQ--></div><div class=\"right hidden\">About<!--a(href=\"#/microsite/about\") About--></div><div class=\"right hidden-xs\">Terms of Use<!--a(href=\"#/microsite/terms\") Terms of Use--></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/menuTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),user = locals_.user;buf.push("<div><div class=\"empty-divider col-xs-0 col-sm-1\"></div><div class=\"col-xs-6 col-sm-5\"><div class=\"logo\"><img id=\"AcrossMold-logo\" src=\"images/logos/logo.png\"/></div></div><div class=\"col-xs-6 col-sm-5\"><div id=\"header-get-quote\" class=\"button hidden-xs\">Get a Quotation</div>");
if ( user)
{
buf.push("<div id=\"account-icon\">");
var imgSrc = user.get("accountPictureUrl")
buf.push("<img src=\"images/account-icon.png\"/></div><div id=\"account-dropdown\"><ul><li class=\"menuitem\"><a href=\"#/dashboard\">My Dashboard</a><span class=\"ss-desktop\"></span></li><hr/><li class=\"menuitem\"><a id=\"edit-account\">Account Settings</a><span class=\"ss-info\"></span></li><hr/><li class=\"menuitem\"><a id=\"logout\">Log Out</a><span class=\"ss-lock\"></span></li></ul></div>");
}
else
{
buf.push("<a id=\"menu-log-in\">Log&nbsp;In</a>");
}
buf.push("</div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/FAQ"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"help-pages-background row\"><div class=\"col-md-3 col-sm-2 col-xs-1\"></div><div class=\"col-md-6 col-sm-8 col-xs-10 terms\"><span class=\"headr\">Frequently Asked Questions</span><div class=\"scrollable-div\"><p class=\"headr\">Why use across-mold.com?</p><p>Sourcing of tooling, processed parts and assemblies can be an expensive process, even when just sourcing locally.</p><p>But now that the world of manufacturing is a truly global one, the cost of global sourcing can be a hugely expensive process.</p><p>So the goal of across-mold.com is to provide a FREE method, for you the buyer to do very specific searches for what you are looking for.</p><p>How much time have you spent in the past looking through out of date directories, researching and traveling to companies that don’t really fit your needs?</p><p>Auditing companies that you know are not a good fit.</p><p>We have created AcrossMold, so you can search in detail for the right supplier.</p><p>You can then be more confident, that the companies you do choose to shortlist, and spend time and money visiting, are a close match from the very beginning.</p><p>Also as the world changes every day, AcrossMold provides a dynamic portal for you to view a constantly changing supplier base.</p><p class=\"headr\">The major processes and services we currently cover are -</p><ul><li>Rapid Prototyping processes and parts</li><li>Precision machined components</li><li>Tooling and parts for plastics – Injection, Compression, Blow, Rotational molds / etc</li><li>Tooling and parts for metals - Die casting, Stamping, Metal Injection Molding etc</li><li>Tooling and parts for other materials - Composites, Ceramics etc</li><li>Sub assemblies – mainly mechanical assemblies, including Jigs & Fixtures</li><li>Support services – tooling repair, engineering changes, preventative maintenance</li><li>Graining / texturing services etc</li><li>Suppliers included are -</li><li>Rapid prototyping companies</li><li>Precision machining companies</li><li>Prototyping and production toolmakers</li><li>Processors of plastics, metals, and other materials</li><li>Jig and fixture manufacturers</li><li>Sub assembly manufacturers, with a vast list of primary and secondary capabilities.</li><li>Support and service companies</li></ul><p>So we hope you will find across-mold.com a valuable resource for finding what you are looking for in this global market.</p><p class=\"message\">Couldn't find what you were looking for?</p><p class=\"center\"><input id=\"ask-us-button\" type=\"button\" value=\"Ask Us\" class=\"button-alt core-button\"/></p></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/about"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"help-pages-background\"><div class=\"row\"><div class=\"col-md-3 col-sm-3 col-xs-1\"></div><div class=\"col-md-6 col-sm-6 col-xs-10 terms light\"><p class=\"headr\">About Across Mold</p><p>no information provided</p></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/contact"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"help-pages-background\"><div class=\"contact-us\"><p class=\"headr\">Contact</p><br/><p class=\"light\">We will assist you to list your business and services or help you identify and contact a supplier.</p><br/><p class=\"light sm\">If you have any suggestions on improving our service, or what you are looking for is not on our search system. Please Contact us.</p><br/><p class=\"light sm\">Or if you would like to send us an RFQ of what you are looking to source, we can help you find the right supplier for you. Please Contact us.</p><div class=\"contact-button\"><a href=\"mailto:contact@across-mold.com\">contact@across-mold.com</a></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/microsite3Dprinting"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"microsite-background sales\"><div data-scroll=\"content\" class=\"microsite-panel-sales scrolldown\"><img src=\"images/microsite_images/3D_printing_lg.jpg\" class=\"sales-header\"/><div class=\"overlay\"><div class=\"vertical-center\"><div class=\"title\">3D Printing</div><div class=\"title\">Additive Manufacturing</div></div></div><div class=\"scroll-arrow\"><img src=\"images/microsite_images/arrow2.png\"/></div></div><a id=\"content\"></a><div class=\"sales-subtitle\"></div><div class=\"row\"><div class=\"col-md-2 col-sm-2 col-xs-1\"></div><div class=\"sales-textdiv col-md-6 col-sm-8 col-xs-10\"><p class=\"hidden-xs\"><br/><br/></p><br/><p class=\"subhead\">3D Printed / Additive Manufactured Parts</p><br/>3D printing is changing fast. Using Across Mold you have access to all the latest technologies.<br/><br/><p class=\"subhead\">Plastic Printed Parts</p><br/>3D printing techniques. SLS, SLA, FDM, Materials include ABS, Nylon,<br/>Secondary operations, include hand finishing, painting, plating and screen printing.<br/><br/><p class=\"subhead\">Metal Printed Parts.</p><br/>Available direct from 3D printer for Prototypes and with secondary machining for production.<br/>Aluminum, Steel, Cobalt Chrome, Titanium, Inconel<br/><br/></div><div class=\"sales-imgdiv col-md-3 col-sm-12\"><img id=\"profileimg\" src=\"images/microsite_images/3Dprinting-profile-sm.jpg\" data-previewid=\"preview-3Dprinting\"/></div></div><div class=\"row\"><div class=\"col-xs-12\"><a href=\"#/quotation\"><input id=\"quotation_button\" value=\"Get a quotation\" type=\"button\" class=\"action-btn double\"/></a></div></div><br/></div><div id=\"preview-3Dprinting\" class=\"largeprofile-preview modal fade\"><div class=\"modal-content\"><img src=\"images/microsite_images/3Dprinting-profile-lg.jpg\" class=\"prevClose\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeCNCmachining"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"microsite-background sales\"><div data-scroll=\"content\" class=\"microsite-panel-sales scrolldown\"><img src=\"images/microsite_images/cnc_machining_lg.jpg\" class=\"sales-header\"/><div class=\"overlay\"><div class=\"vertical-center\"><div class=\"title\">CNC Machining</div></div></div><div class=\"scroll-arrow\"><img src=\"images/microsite_images/arrow2.png\"/></div></div><a id=\"content\"></a><div class=\"sales-subtitle\"></div><div class=\"row\"><div class=\"col-md-2 col-sm-2 col-xs-1\"></div><div class=\"sales-textdiv col-md-6 col-sm-8 col-xs-10\"><p class=\"hidden-xs\"><br/><br/></p><br/><br/><p class=\"subhead\">Precision Machined Parts</p><br/>Plastics and Metals\nQuantities from 1 off, to batch production, to full volume production.\nCNC, milling and turning including 5 Axis CNC\nPart materials - Full range of Engineering Thermoplastic and Metals.<br/><br/><p class=\"subhead\">Finishing</p><br/>Bead blasting, Anodizing, Plating, painting,<br/></div><div class=\"sales-imgdiv col-md-3 col-sm-12\"><img id=\"profileimg\" src=\"images/microsite_images/cnc-machining-profile-sm.jpg\" data-previewid=\"preview-cnc-machining\"/></div></div><div class=\"row\"><div class=\"col-xs-12\"><a href=\"#/quotation\"><input id=\"quotation_button\" value=\"Get a quotation\" type=\"button\" class=\"action-btn double\"/></a></div></div><br/></div><div id=\"preview-cnc-machining\" class=\"largeprofile-preview modal fade\"><div class=\"modal-content\"><img src=\"images/microsite_images/cnc-machining-profile-lg.jpg\" class=\"prevClose\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeDieCasting"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"microsite-background sales\"><div data-scroll=\"content\" class=\"microsite-panel-sales scrolldown\"><img src=\"images/microsite_images/die_casting_lg.jpg\" class=\"sales-header\"/><div class=\"overlay\"><div class=\"vertical-center\"><div class=\"title\">Metal Die Casting</div></div></div><div class=\"scroll-arrow\"><img src=\"images/microsite_images/arrow2.png\"/></div></div><a id=\"content\"></a><div class=\"sales-subtitle\"></div><div class=\"row\"><div class=\"col-md-2 col-sm-2 col-xs-1\"></div><div class=\"sales-textdiv col-md-6 col-sm-8 col-xs-10\"><p class=\"hidden-xs\"><br/><br/></p><br/><br/><p class=\"subhead\">Metal Die Casting</p><br/>Pressure and Gravity casting.\nLow and high volume production.\nSecondary operations, machining, bead blasting and painting.<br/><br/><p class=\"subhead\">Materials</p>Aluminum, Zinc and Magnesium.</div><div class=\"sales-imgdiv col-md-3 col-sm-12\"><img id=\"profileimg\" src=\"images/microsite_images/die-casting-profile-sm.jpg\" data-previewid=\"preview-die-casting\"/></div></div><div class=\"row\"><div class=\"col-xs-12\"><a href=\"#/quotation\"><input id=\"quotation_button\" value=\"Get a quotation\" type=\"button\" class=\"action-btn double\"/></a></div></div><br/></div><div id=\"preview-die-casting\" class=\"largeprofile-preview modal fade\"><div class=\"modal-content\"><img src=\"images/microsite_images/die-casting-profile-lg.jpg\" class=\"prevClose\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeInjectionMolding"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"microsite-background sales\"><div data-scroll=\"content\" class=\"microsite-panel-sales scrolldown\"><img src=\"images/microsite_images/injection_molding_lg.jpg\" class=\"sales-header\"/><div class=\"overlay\"><div class=\"vertical-center\"><div class=\"title\">Injection Molding</div></div></div><div class=\"scroll-arrow\"><img src=\"images/microsite_images/arrow2.png\"/></div></div><a id=\"content\"></a><div class=\"sales-subtitle\"></div><div class=\"row\"><div class=\"col-md-2 col-sm-2 col-xs-1\"></div><div class=\"sales-textdiv col-md-6 col-sm-8 col-xs-10\"><p class=\"hidden-xs\"><br/><br/></p><br/><p class=\"subhead\">Plastic Injection molded parts</p><br/>From high detail micro parts, to large industrial enclosures.<br/>Low cost, low volume and bridge tooling.<br/>High volume full production molds.<br/>Part materials - Full range of Engineering thermoplastic and Thermosets.<br/><br/><p class=\"subhead\">Mold Tooling – for molds you want to run</p><br/>Short Run low cost molds, to high volume production molds, built to high specification International standards.<br/>Single and multi-cavity molds.<br/>Unscrewing, hot runner, and 2 shot molds<br/>Mold materials - Aluminum, P20, NAK 80, H13<br/></div><div class=\"sales-imgdiv col-md-3 col-sm-12\"><img id=\"profileimg\" src=\"images/microsite_images/injection-molding-profile-sm.jpg\" data-previewid=\"preview-injection-molding\"/></div></div><div class=\"row\"><div class=\"col-xs-12\"><a href=\"#/quotation\"><input id=\"quotation_button\" value=\"Get a quotation\" type=\"button\" class=\"action-btn double\"/></a></div></div><br/></div><div id=\"preview-injection-molding\" class=\"largeprofile-preview modal fade\"><div class=\"modal-content\"><img src=\"images/microsite_images/injection-molding-profile-lg.jpg\" class=\"prevClose\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeMaster"] = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"parallax-images\"><a class=\"parallax-images\"></a></div><div id=\"landing-background\" class=\"microsite-background\"><div data-image=\"images/microsite_images/main-image1-lg.jpg\" data-image-sm=\"images/microsite_images/main-image1-sm.jpg\" data-image-md=\"images/microsite_images/main-image1-md.jpg\" class=\"img-holder image1\"></div><div data-scroll=\"micro-slide-1\" class=\"top-overlay scrolldown-top\"><div class=\"microheadline\"><div class=\"medd\"></div><div class=\"medd\"></div><div class=\"medd\"></div><img src=\"images/microsite_images/arrow2.png\" data-scroll=\"micro-slide-1\" class=\"scrolldown-top-button\"/></div></div><a id=\"micro-slide-1\"></a><div data-scroll=\"micro-slide-2\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-1 col-sm-10 col-xs-offset-0 col-xs-12 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-1.jpg\" class=\"landing-contentslide left\"/></div><div class=\"col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\"> </p><p> </p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-1.jpg\" class=\"landing-contentslide\"/></div><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p>Top Ten mold maker in China </p><p>Supplying USA Blue Chip customers for over 18 years</p><p>ISO 9001 2000</p><p>Highest Quality built to international standards</p><p>Very competitive pricing </p></div></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-2\" class=\"scrolldown-arrow\"/></div></div></div><div data-image=\"images/microsite_images/main-image2-lg.jpg\" data-image-sm=\"images/microsite_images/main-image2-sm.jpg\" data-image-md=\"images/microsite_images/main-image2-md.jpg\" class=\"img-holder image2\"></div><a id=\"micro-slide-2\"></a><div data-scroll=\"micro-slide-3\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-2.jpg\" class=\"landing-contentslide\"/></div><div class=\"col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\">Company</p><p>Established 1998</p><p>90,000sqft Facility</p><p>300 moldmakers </p><p>Producing 500-600 mold per year </p><p>90% Exported molds to USA, Europe and Japan </p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p class=\"subhead\">Company</p><p>Established 1998</p><p>90,000sqft Facility</p><p>300 moldmakers </p><p>Producing 500-600 mold per year </p><p>90% Exported molds to USA, Europe and Japan </p></div></div><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-2.jpg\" class=\"landing-contentslide\"/></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-3\" class=\"scrolldown-arrow\"/></div></div></div><div data-image=\"images/microsite_images/main-image3-lg.jpg\" data-image-sm=\"images/microsite_images/main-image3-sm.jpg\" data-image-md=\"images/microsite_images/main-image3-md.jpg\" class=\"img-holder image3\"></div><a id=\"micro-slide-3\"></a><div data-scroll=\"micro-slide-4\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-1 col-sm-10 col-xs-offset-0 col-xs-12 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-3.jpg\" class=\"landing-contentslide\"/></div><div class=\"col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\">Mold types</p><p>Full range, from small, tight tolerance parts, to large industrial and automotive parts. </p><p>Maximum mold weight 20Tons</p><p>Hot runner molds, multi-cavity, unscrewing, multi-shot, overmold, sequential valve gate. </p><p class=\"subhead\">Markets </p><p>Automotive, consumer products, medical, lawn and garden, electronic and Industrial products</p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-3.jpg\" class=\"landing-contentslide\"/></div><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p class=\"subhead\">Mold types</p><p>Full range, from small, tight tolerance parts, to large industrial and automotive parts. </p><p>Maximum mold weight 20Tons</p><p>Hot runner molds, multi-cavity, unscrewing, multi-shot, overmold, sequential valve gate. </p><p class=\"subhead\">Markets </p><p>Automotive, consumer products, medical, lawn and garden, electronic and Industrial products</p></div></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-4\" class=\"scrolldown-arrow\"/></div></div></div><div data-image=\"images/microsite_images/main-image4-lg.jpg\" data-image-sm=\"images/microsite_images/main-image4-sm.jpg\" data-image-md=\"images/microsite_images/main-image4-md.jpg\" class=\"img-holder image4\"></div><a id=\"micro-slide-4\"></a><div data-scroll=\"micro-slide-5\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-4.jpg\" style=\"width: 65%;\" class=\"landing-contentslide\"/></div><div class=\"col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\">Top ten mold maker in China </p><p>By investing in People, Processes and Equipment </p><p>Latest design tools, latest machining, inspection and sampling equipment.</p><p>Customer focused – we want your mold to run as soon as you get it, the way you want it.</p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p class=\"subhead\">Top ten mold maker in China </p><p>By investing in People, Processes and Equipment </p><p>Latest design tools, latest machining, inspection and sampling equipment.</p><p>Customer focused – we want your mold to run as soon as you get it, the way you want it.</p></div></div><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-4.jpg\" class=\"landing-contentslide\"/></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-5\" class=\"scrolldown-arrow\"/></div></div></div><div data-image=\"images/microsite_images/main-image5-lg.jpg\" data-image-sm=\"images/microsite_images/main-image5-sm.jpg\" data-image-md=\"images/microsite_images/main-image5-md.jpg\" class=\"img-holder image4\"></div><a id=\"micro-slide-5\"></a><div data-scroll=\"micro-slide-6\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-5.jpg\" style=\"width: 65%;\" class=\"landing-contentslide\"/></div><div class=\"col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\">Quality ISO 9001 2000</p><p>Mold Steel Hardness Inspection</p><p>Electrodes Inspection</p><p>Core and Cavity Steel Dimension inspection</p><p>Mold Pre-Assembly Inspection</p><p>Trial Report and Samples inspection</p><p>Pre-Shipment Final Inspection</p><p>Export Mold Package Inspection</p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-5.jpg\" class=\"landing-contentslide\"/></div><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p class=\"subhead\">Quality ISO 9001 2000</p><p>Mold Steel Hardness Inspection</p><p>Electrodes Inspection</p><p>Core and Cavity Steel Dimension inspection</p><p>Mold Pre-Assembly Inspection</p><p>Trial Report and Samples inspection</p><p>Pre-Shipment Final Inspection</p><p>Export Mold Package Inspection</p></div></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-6\" class=\"scrolldown-arrow\"/></div></div></div><div data-image=\"images/microsite_images/main-image6-lg.jpg\" data-image-sm=\"images/microsite_images/main-image6-sm.jpg\" data-image-md=\"images/microsite_images/main-image6-md.jpg\" class=\"img-holder image4\"></div><a id=\"micro-slide-6\"></a><div data-scroll=\"micro-slide-7\" class=\"microsite-content scrolldown\"><div class=\"row table\"><div class=\"col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10 hidden-md hidden-lg\"><img src=\"images/microsite_images/slide-img-6.jpg\" style=\"width: 65%;\" class=\"landing-contentslide\"/></div><div class=\"col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11 hidden-md hidden-lg\"><div class=\"landing-contentslide\"><p class=\"subhead\">In house trialing </p><p>Very important to ensure the mold runs well when you receive it.</p><p>Every mold cycled for 6 hours </p><p>6 presses 50 ton to 500 tons. </p><p>Highly trained process technicians</p></div></div><div class=\"col-md-8 col-md-offset-2 hidden-sm hidden-xs\"><div class=\"cell-middle description\"><div class=\"landing-contentslide\"><p class=\"subhead\">In house trialing </p><p>Very important to ensure the mold runs well when you receive it.</p><p>Every mold cycled for 6 hours </p><p>6 presses 50 ton to 500 tons. </p><p>Highly trained process technicians</p></div></div><div class=\"cell-middle image\"><img src=\"images/microsite_images/slide-img-6.jpg\" class=\"landing-contentslide\"/></div></div></div><div class=\"row\"><div class=\"col-md-12 micro-slide-down\"><img src=\"images/microsite_images/arrow_half.png\" data-scroll=\"micro-slide-7\" class=\"scrolldown-arrow\"/></div></div></div><a id=\"micro-slide-7\"></a><div class=\"microsite-action\"><div class=\"row\"><div class=\"col-md-4 col-sm-4 col-xs-0\"></div><div class=\"col-md-4 col-sm-4 col-xs-12\"><div style=\"display: inline-block\"><div data-navigate=\"#/quotation\" class=\"action-btn double\">Get a quotation</div></div></div></div><div class=\"row visible-xs\"><br/><br/></div><div class=\"row hidden-xs\"><br/><br/><br/><br/><div class=\"col-12 header\">Find out more</div></div><div class=\"row\"><div class=\"col-md-1 col-xs-0\"></div><div class=\"col-md-10 col-xs-12\"><div style=\"display: inline-block\"><div class=\"action-holder\"><div data-navigate=\"#/microsite/3Dprinting\" class=\"action-btn\">3D&nbsp;Printing</div><div data-navigate=\"#/microsite/InjectionMolding\" class=\"action-btn\">Plastic&nbsp;Injection Molding</div><div data-navigate=\"#/microsite/DieCasting\" class=\"action-btn\">Metal Die&nbsp;Casting</div><div data-navigate=\"#/microsite/CNCmachining\" class=\"action-btn\">Precision Machining</div><div data-navigate=\"#/microsite/Other\" class=\"action-btn\">Other&nbsp;Processes</div></div></div></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeOther"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"microsite-background sales\"><div data-scroll=\"content\" class=\"microsite-panel-sales scrolldown\"><img src=\"images/microsite_images/other_lg.jpg\" class=\"sales-header\"/><div class=\"overlay\"><div class=\"vertical-center\"><div class=\"title\">Other Processes</div></div></div><div class=\"scroll-arrow\"><img src=\"images/microsite_images/arrow2.png\"/></div></div><a id=\"content\"></a><div class=\"sales-subtitle\"></div><div class=\"row\"><div class=\"col-md-2 col-sm-2 col-xs-1\"></div><div class=\"sales-textdiv col-md-6 col-sm-8 col-xs-10\"><p class=\"hidden-xs\"><br/><br/></p><br/><p class=\"subhead\">Other processes</p><br/>If you require parts or tooling for other mechanical processes, please send contact us or us an enquiry and we will try to help.\nExamples - Sheet metal fabrication, Metal Injection Molding, Jig and fixtures, Compression molding, Carbon composites, Ceramic parts.<br/><br/><p class=\"subhead\">Our Global network</p><br/>Awe are here to help you find aluminum, Zinc and Magnesium.<br/></div><div class=\"sales-imgdiv col-md-3 col-sm-12\"><img id=\"profileimg\" src=\"images/microsite_images/other-profile-sm.jpg\" data-previewid=\"preview-other\"/></div></div><div class=\"row\"><div class=\"col-xs-12\"><a href=\"#/quotation\"><input id=\"quotation_button\" value=\"Get a quotation\" type=\"button\" class=\"action-btn double\"/></a></div></div><br/></div><div id=\"preview-other\" class=\"largeprofile-preview modal fade\"><div class=\"modal-content\"><img src=\"images/microsite_images/other-profile-lg.jpg\" class=\"prevClose\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeSearch"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"wrapper\"><div class=\"microsite-learn-more\"><h1>What is Across Mold?</h1><p> </p><h2>Search</h2><p>Search for your ideal manufacturing partner.<div class=\"action-buttons audience-buttons learn-more\"><a href=\"#/register\"><input value=\"Get Started\" type=\"button\" class=\"button core-button\"/></a></div></p></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/micrositeSubMenu"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"sub-menu hidden-sm hidden-xs\"><div class=\"wrapper\"><!--a(href=\"#/microsite/MoldTypes\")--><a href=\"#\"><input type=\"button\" value=\"Mold types\" class=\"button white-button\"/></a><a href=\"#\"><input type=\"button\" value=\"Company\" class=\"button white-button\"/></a><a href=\"#\"><input type=\"button\" value=\"Services\" class=\"button white-button\"/></a><a href=\"#\"><input type=\"button\" value=\"Quality\" class=\"button white-button\"/></a><a href=\"#\"><input type=\"button\" value=\"USA Support\" class=\"button white-button\"/></a><a href=\"#\"><input type=\"button\" value=\"Contact\" class=\"button white-button\"/></a></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/microsite/terms"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"help-pages-background row\"><div class=\"col-md-3 col-sm-2 col-xs-1\"></div><div id=\"terms-of\" class=\"col-md-6 col-sm-8 col-xs-10 terms\"><span class=\"headr\">Terms of use</span><div class=\"scrollable-div\"><p>Welcome to across-mold.com. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Across Mold's relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</p><p>The term 'Across Mold' or 'us' or 'we' refers to the owner of the website whose registered office is 2607 Woodruff Road Suite E203 Simpsonville South Carolina 29681 USA. Our company registration number is Reg. No. 52-2405964 South Carolina. The term 'you' refers to the user or viewer of our website.</p><p>The use of this website is subject to the following terms of use:</p><p>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</p><p>This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: security token for vendor profile creation.</p><p>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p><p>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</p><p>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p><p>All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.</p><p>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offense.</p><p>From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</p><br/><p>Disclaimer</p><br/><ol class=\"legal\"><li>Introduction - This disclaimer governs your use of our website; by using our website, you accept this disclaimer in full. If you disagree with any part of this disclaimer, do not use our website.</li><li>Intellectual Property Rights - Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all our intellectual property rights are reserved.</li><li>License to Use Website - You may view, download for caching purposes only, and print pages from the website, provided that:<ol class=\"legal sublist\"><li class=\"sublist\">You must not republish material from this website (including republication on another website), or reproduce or store material from this website in any public or private electronic retrieval system. (Though we encourage fair use for academic / non commercial purposes)</li><li class=\"sublist\">You must not reproduce, duplicate, copy, sell, resell, visit, or otherwise exploit our website or material on our website for a commercial purpose, without our express written consent;</li></ol></li><li>Limitations of Liability - The information on this website is provided free-of-charge, and you acknowledge that it would be unreasonable to hold us liable in respect of this website and the information on this website. Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we not commit to ensuring that the website remains available or that the material on this website is kept up-to-date. To the maximum extent permitted by applicable law we exclude all representations, warranties and conditions (including, without limitation, the conditions implied by law of satisfactory quality, fitness for purpose and the use of reasonable care and skill). Our liability is limited and excluded to the maximum extent permitted under applicable law. We will not be liable for any direct, indirect or consequential loss or damage arising under this disclaimer or in connection with our website, whether arising in tort, contract, or otherwise - including, without limitation, any loss of profit, contracts, business, goodwill, data, income, revenue or anticipated savings. However, nothing in this disclaimer shall exclude or limit our liability for fraud, for death or personal injury caused by our negligence, or for any other liability which cannot be excluded or limited under applicable law.</li><li>Forum Posting / Comments - You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website. You must not use our website in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.<ul><li>You must not use our website for any purposes related to marketing without our express written consent.</li><li>You must not use our website to copy, publish or send mass mailings or spam.</li><li>You must not use our website to copy, publish or send material which is illegal or unlawful, or material which could give rise to legal action under English and other applicable law. All material you copy, publish or send via our website must not be defamatory, obscene, indecent, hateful, discriminatory or inflammatory; such material must not infringe any person's intellectual property rights or rights of confidence, impinge upon any person's privacy, or constitute incitement to commit a crime; further, material must not be misleading, deceptive, pornographic, threatening, abusive, harassing or menacing.</li><li>We reserve the right to edit or remove any material posted upon our website.</li><li>We may take such action as we deem appropriate to deal with the posting of unsuitable material, including suspending or canceling your account, restricting your access to our website, or commencing legal proceedings against you.</li><li>In respect of all material that you post on our website, you grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute such material in any media, together with the right to sub-license such rights.</li></ul></li><li>Third party websites The website contains links to other websites. We are not responsible for the content of third party websites.</li><li>Variation - We may revise this disclaimer from time-to-time. Please check this page regularly to ensure you are familiar with the current version.</li><li>Entire agreement - This disclaimer constitutes the entire agreement between you and us in relation to your use of our website, and supersedes all previous agreements in respect of your use of this website.</li><li>Law and Jurisdiction - This notice will be governed by and construed in accordance with United States law, and any disputes relating to this notice shall be subject to the exclusive jurisdiction of the courts of the United States.</li><li>Our Contact Details - You can contact us by Email.</li></ol></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/accountEdit-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),user = locals_.user;buf.push("<ddiv id=\"account-settings-modal\" class=\"account-settings popover\"><div data-target=\".account-settings\" data-closemodal=\"account-settings-modal\" class=\"ss-delete close-modal\"></div><br/><div class=\"main title\">Edit account settings</div><div class=\"edit-line\"><div class=\"editing-subtitle\">Account name</div><input" + (jade.attrs({ 'type':("text"), 'placeholder':("First Name"), 'id':("acntfirst"), 'value':(user.firstName), "class": [("settings firstname")] }, {"class":true,"type":true,"placeholder":true,"id":true,"value":true})) + "/><input" + (jade.attrs({ 'type':("text"), 'placeholder':("Last Name"), 'id':("acntlast"), 'value':(user.lastName), "class": [("settings lastname")] }, {"class":true,"type":true,"placeholder":true,"id":true,"value":true})) + "/></div><div class=\"edit-line\"><div class=\"editing-subtitle\">Account email</div><input" + (jade.attrs({ 'type':("email"), 'placeholder':("Email"), 'id':("acntemail"), 'value':(user.email), "class": [("settings email")] }, {"class":true,"type":true,"placeholder":true,"id":true,"value":true})) + "/></div><div class=\"edit-line\"><div class=\"editing-subtitle\">Change password</div><input id=\"acct-new-password\" type=\"password\" placeholder=\"enter new password\" class=\"settings password\"/><br/><input id=\"acct-confirm-password\" type=\"password\" placeholder=\"confirm password\" class=\"settings password\"/></div><div class=\"update-buttons\"><input id=\"delete-account\" type=\"button\" value=\"Delete\" class=\"visible-xs button-link\"/><input id=\"delete-account\" type=\"button\" value=\"Delete Account\" class=\"hidden-xs button-link\"/><input id=\"save-account-settings\" type=\"button\" value=\"Save\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"account-settings-modal\" value=\"Cancel\" class=\"hidden-xs button-link close-modal\"/></div></ddiv><div id=\"confirm-delete-modal\" class=\"popover\"><span data-closemodal=\"confirm-delete-modal\" class=\"ss-delete close-modal\"></span>WARNING: If you delete your account it cannot be recovered.<br/><br/>We recommand disabling all profiles with the link below to exclude them from. Disabling your profiles will retained them for future use.<div class=\"update-buttons\"><input id=\"disable-profiles\" type=\"button\" value=\"Disable\" class=\"button-link\"/><input id=\"delete-account-confirmed\" type=\"button\" value=\"Delete\" class=\"button-alt core-button\"/><input type=\"button\" data-closemodal=\"confirm-delete-modal\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/favorite-created-modal"] = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"favorite-created\" class=\"modal-content popover\"><div class=\"modal-body\"><span id=\"fav-created-close\" class=\"ss-delete\"></span><h4 class=\"modal-title\">This profile has been saved to</h4><h4 class=\"modal-title\">\"My Favorites.\"</h4><div class=\"check-mark-img\"></div><h4 class=\"modal-title\">To view, visit your &nbsp;<a href=\"#/dashboard/favorites\">Dashboard.</a></h4></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/login-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),title = locals_.title;buf.push("<div id=\"login-box\" class=\"modal-content popover\"><div class=\"modal-body\"><span id=\"login-close\" class=\"ss-delete\"></span>");
if ( title)
{
buf.push("<h4 id=\"myModalLabel\" class=\"modal-title\">" + (jade.escape(null == (jade.interp = title) ? "" : jade.interp)) + "</h4>");
}
else
{
buf.push("<h4 id=\"myModalLabel\" class=\"modal-title\">Login to your account.</h4>");
}
buf.push("<div class=\"email-pass-inputs\"><input type=\"email\" placeholder=\"Email\" id=\"login-email\" class=\"login-email-input\"/><input type=\"password\" placeholder=\"Password\" id=\"login-password\" name=\"pwd\" class=\"login-password-input\"/><input type=\"button\" id=\"submit-login\" value=\"Submit\" class=\"search-button button\"/><br/><p id=\"center-login\">Don't have an account? &nbsp;<a id=\"bold-login\" href=\"#/register\">Sign Up</a></p></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/message-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),messageText = locals_.messageText;buf.push("<div id=\"site-message-modal\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><pre id=\"site-message\">" + (jade.escape(null == (jade.interp = messageText) ? "" : jade.interp)) + "</pre><br/><br/><input value=\"Ok\" type=\"button\" class=\"close-message\"/></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/promo-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),videoUrl = locals_.videoUrl;buf.push("<div id=\"promo-modal\" class=\"modal fade\"><img src=\"images/loading-orange.gif\"/><div id=\"promo-close\" class=\"ss-delete\"></div>");
if ( (videoUrl))
{
buf.push("<iframe id='videoplayer' src=\"" + (jade.escape((jade.interp = videoUrl) == null ? '' : jade.interp)) + "\" frameborder=\"0\"></iframe>");
}
else
{
buf.push("<iframe id='videoplayer' src=\"http://www.youtube.com/embed/QjnI4ky5o3k?rel=0&autoplay=1&autohide=1\" frameborder=\"0\"></iframe>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/quotationEdit-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),contactName = locals_.contactName,contactEmail = locals_.contactEmail,companyName = locals_.companyName,jobTitle = locals_.jobTitle,jobDescription = locals_.jobDescription;buf.push("<div id=\"edit-quotation-modal\" class=\"row popover col-lg-6 col-lg-offset-3 col-md-8 col-lg-offset-2 col-xs-10 col-xs-offset-1\"><div data-target=\".edit-quotation\" data-closemodal=\"edit-quotation-modal\" class=\"ss-delete close-modal\"></div><br/><div class=\"main title row col-xs-10\">Get A Quotation</div><br/><br/><div class=\"edit-line row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Your name</div><input" + (jade.attrs({ 'id':('quote_contact_name'), 'type':("text"), 'placeholder':("enter your name"), 'value':(contactName), "class": [('col-xs-6'),("settings personname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"edit-line row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">E-mail</div><input" + (jade.attrs({ 'id':('quote_email'), 'type':("email"), 'placeholder':("enter email address"), 'value':(contactEmail), "class": [('col-xs-6'),("settings email")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"edit-line row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Company</div><input" + (jade.attrs({ 'id':('quote_company_name'), 'type':("text"), 'placeholder':("enter the name of your company"), 'value':(companyName), "class": [('col-xs-6'),("settings companyname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"edit-line row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Job Name</div><input" + (jade.attrs({ 'id':('quote_job_name'), 'type':("text"), 'placeholder':("enter a job name or title"), 'value':(jobTitle), "class": [('col-xs-8'),("settings jobname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"edit-line row\"><div class=\"editing-subtitle row col-xs-10 col-xs-offset-1\">Job Description</div><textarea" + (jade.attrs({ 'id':('quote_job_details'), 'type':("text"), 'rows':("10"), 'placeholder':("enter a detailed job description"), 'value':(jobDescription), "class": [('row'),('col-xs-10'),('col-xs-offset-1'),("settings jobdetails")] }, {"class":true,"type":true,"rows":true,"placeholder":true,"value":true})) + "></textarea></div><div class=\"edit-line row\"><div class=\"editing-subtitle row col-xs-10 col-xs-offset-1\">Attachments - design documents, CAD drawings, supporting material</div></div><br/><br/><br/><br/><br/><div class=\"row update-buttons\"><input id=\"quote_submit\" type=\"button\" value=\"Send\" class=\"visible-xs button-alt greenbutton\"/><input id=\"quote_submit\" type=\"button\" value=\"Send Request\" class=\"hidden-xs button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"account-settings-modal\" value=\"Cancel\" class=\"hidden-xs button-link close-modal\"/></div></div><div id=\"quotation-remove-document-modal\" class=\"popover\"><span data-closemodal=\"quotation-remove-document-modal\" class=\"ss-delete close-modal\"></span>Are you sure you want to remove this document? <div class=\"update-buttons\"><input id=\"confirm-remove\" type=\"button\" value=\"Confirm\" class=\"button-link\"/><input type=\"button\" data-closemodal=\"quotation-remove-document-modal\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div><div id=\"quotation-add-document-modal\" class=\"popover\"><span data-closemodal=\"quotation-add-document-modal\" class=\"ss-delete close-modal\"></span>Browse to select file<br/><input id=\"quotation_file\" type=\"file\" accept=\"*\" class=\"quotation-upload\"/><div class=\"update-buttons\"><input id=\"upload-quotation-file\" type=\"button\" value=\"Upload\" class=\"button-alt core-button\"/><input type=\"button\" data-closemodal=\"quotation-add-document-modal\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/thankyou-modal"] = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"thankyou-message\"><span id=\"close-thankyou\" class=\"ss-delete\"></span><span class=\"thanks\">Thanks for visiting!</span></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/modals/wait-modal"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),messageText = locals_.messageText;buf.push("<div id=\"site-message-modal\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><pre id=\"site-message\">" + (jade.escape(null == (jade.interp = messageText) ? "" : jade.interp)) + "</pre><br/><br/></div><div class=\"working-animation\"></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileAttributesViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,Mi = locals_.Mi,key = locals_.key;buf.push("<div class=\"attributes-area\"><div class=\"attributes-features\">");
var photoUrl = "images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
photoUrl = profile.profilePictureUrl
}
buf.push("<div" + (jade.attrs({ 'id':('profile-picture'), 'style':("background:url('"+ photoUrl +"')"), "class": [('attributes-photo')] }, {"style":true})) + "><span id=\"edit-profile-photo\" class=\"ss-write edit-icon attr-section-icon\"></span></div><div id=\"profile-photo-modal\" class=\"popover\"><span data-closemodal=\"profile-photo-modal\" class=\"ss-delete close-modal\"></span><div class=\"user-image-preview-profile\"><div id=\"profilePicturePreview\"></div><input type=\"file\" id=\"profileImgUpload\" accept=\"image/*\" class=\"uploadbox\"/><div class=\"upload-buttons\"><input type=\"button\" id=\"upload-profile-image\" value=\"Upload\" disabled=\"true\" class=\"greenbutton right\"/></div></div></div><div class=\"profile-subtitle\">Features<span data-openmodal=\"attributesFeaturesEdit\" class=\"ss-write edit-icon attr-section-icon features-edit-icon open-modal\"></span><div class=\"profile-features-area\">");
if ( profile.profileFeatures)
{
buf.push("<ul>");
if ( Mi.CMS[profile.profileType])
{
for(key in Mi.CMS[profile.profileType].attributes)
{
var value = profile.profileFeatures[key] ? profile.profileFeatures[key] : ''
buf.push("<li>" + (jade.escape(null == (jade.interp = Mi.CMS.labels[key] + ": " + value) ? "" : jade.interp)) + "</li>");
}
}
buf.push("</ul>");
}
else if ( Mi.CMS[profile.profileType])
{
buf.push("<ul>");
for(key in Mi.CMS[profile.profileType].attributes)
{
buf.push("<li>" + (jade.escape(null == (jade.interp = Mi.CMS.labels[key] + ":") ? "" : jade.interp)) + "</li>");
}
buf.push("</ul>");
}
buf.push("</div></div></div><div class=\"attributes-location\"><span id=\"edit-location\" class=\"ss-write edit-icon location-icon\"></span><div class=\"profile-subtitle\">Location</div><div class=\"location-container\"><div id=\"location-map\" class=\"location-map\"><img src=\"images/placeholder_imgs/location_placeholder.jpg\"/></div></div></div><div id=\"attributesLocationEdit\" class=\"attributes-location-edit popover\"><span data-closemodal=\"attributesLocationEdit\" class=\"ss-delete close-modal\"></span><div class=\"profile-subtitle\">Edit Location</div><div class=\"editing-subtitle\">");
if ( (profile.profileType == 'executive' || profile.profileType == 'performer' || profile.profileType == 'behindthescenes'))
{
buf.push("Enter your city or state. Please keep your address confidential.");
}
else
{
buf.push("Help users find your business by entering your address.");
}
buf.push("</div><br/><div class=\"profile-location-input-container\"><input type=\"text\" id=\"gmap-input\" class=\"profile-location-input\"/>&nbsp;<span><a class=\"clear-location-input\">clear</a></span></div><br/><br/><div id=\"location-edit-preview\" class=\"location-map\"><img src=\"images/placeholder_imgs/location_placeholder_edit.jpg\"/></div><div class=\"update-buttons pull-left\"><input type=\"button\" value=\"Update\" id=\"save-location\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"attributesLocationEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div><div id=\"attributesFeaturesEdit\" class=\"popover attrs-area-edit\"><div class=\"title-edit-top\"><span data-closemodal=\"attributesFeaturesEdit\" class=\"ss-delete close-modal\"></span><span class=\"editing-title\">Edit Features Information</span><br/><br/><span class=\"editing-subtitle\">Enter only the details which will improve your chances of matching search criteria.</span>");
var attributeList = []
if(profile.profileType && Mi.CMS[profile.profileType])
{
attributeList = Mi.CMS[profile.profileType].attributes
}
buf.push("<div class=\"features-select-boxes\"><div class=\"float-ul\"><ul>");
var evenCtr=0
// iterate attributeList
;(function(){
  var $$obj = attributeList;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var val = $$obj[index];

evenCtr += 1
if ( evenCtr % 2 == 1)
{
var labelStr = Mi.CMS.labels[index]
buf.push("<li><div class=\"attrs-feature-label editing-subtitle\">" + (jade.escape(null == (jade.interp = labelStr) ? "" : jade.interp)) + "</div><select" + (jade.attrs({ 'type':("text"), 'data-featurename':(index), 'data-placeholder':(Mi.CMS.prompts[index]), "class": [('attrs-feature-input')] }, {"type":true,"data-featurename":true,"data-placeholder":true})) + "><option>" + (jade.escape(null == (jade.interp = "") ? "" : jade.interp)) + "</option>");
// iterate attributeList[index]
;(function(){
  var $$obj = attributeList[index];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select></li>");
}
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var val = $$obj[index];

evenCtr += 1
if ( evenCtr % 2 == 1)
{
var labelStr = Mi.CMS.labels[index]
buf.push("<li><div class=\"attrs-feature-label editing-subtitle\">" + (jade.escape(null == (jade.interp = labelStr) ? "" : jade.interp)) + "</div><select" + (jade.attrs({ 'type':("text"), 'data-featurename':(index), 'data-placeholder':(Mi.CMS.prompts[index]), "class": [('attrs-feature-input')] }, {"type":true,"data-featurename":true,"data-placeholder":true})) + "><option>" + (jade.escape(null == (jade.interp = "") ? "" : jade.interp)) + "</option>");
// iterate attributeList[index]
;(function(){
  var $$obj = attributeList[index];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select></li>");
}
    }

  }
}).call(this);

buf.push("</ul></div><div class=\"float-ul\"><ul>");
var oddCtr = 0
// iterate attributeList
;(function(){
  var $$obj = attributeList;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var val = $$obj[index];

oddCtr += 1
if ( oddCtr % 2 == 0)
{
var labelStr = Mi.CMS.labels[index]
buf.push("<li><div class=\"attrs-feature-label editing-subtitle\">" + (jade.escape(null == (jade.interp = labelStr) ? "" : jade.interp)) + "</div><select" + (jade.attrs({ 'type':("text"), 'data-featurename':(index), 'data-placeholder':(Mi.CMS.prompts[index]), "class": [('attrs-feature-input')] }, {"type":true,"data-featurename":true,"data-placeholder":true})) + "><option>" + (jade.escape(null == (jade.interp = "") ? "" : jade.interp)) + "</option>");
// iterate attributeList[index]
;(function(){
  var $$obj = attributeList[index];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select></li>");
}
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var val = $$obj[index];

oddCtr += 1
if ( oddCtr % 2 == 0)
{
var labelStr = Mi.CMS.labels[index]
buf.push("<li><div class=\"attrs-feature-label editing-subtitle\">" + (jade.escape(null == (jade.interp = labelStr) ? "" : jade.interp)) + "</div><select" + (jade.attrs({ 'type':("text"), 'data-featurename':(index), 'data-placeholder':(Mi.CMS.prompts[index]), "class": [('attrs-feature-input')] }, {"type":true,"data-featurename":true,"data-placeholder":true})) + "><option>" + (jade.escape(null == (jade.interp = "") ? "" : jade.interp)) + "</option>");
// iterate attributeList[index]
;(function(){
  var $$obj = attributeList[index];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

if ( profile.profileFeatures && profile.profileFeatures[index] == val)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade.interp = val) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select></li>");
}
    }

  }
}).call(this);

buf.push("</ul></div></div><div class=\"save-features-buttons\"><input type=\"button\" value=\"Done\" id=\"save-features\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"attributesFeaturesEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileAttrsUpdate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,key = locals_.key,Mi = locals_.Mi;if ( (profile.profileFeatures))
{
buf.push("<ul>");
for(key in Mi.CMS[profile.profileType].attributes)
{
var value = profile.profileFeatures[key] ? profile.profileFeatures[key] : ''
buf.push("<li>" + (jade.escape(null == (jade.interp = Mi.CMS.labels[key] + ": " + value) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul>");
};return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileEditPublishStatusTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),isPublished = locals_.isPublished,lessThan50 = locals_.lessThan50;if ( isPublished)
{
buf.push("<span class=\"subtitle goprivate-message\">Profile is</span><span class=\"go-private-button\">LIVE!</span>");
}
else if ( lessThan50)
{
buf.push("<span class=\"subtitle\">Complete 50% to go live.</span>");
}
else
{
buf.push("<span class=\"subtitle golive-message\">Profile is</span><span class=\"go-live-button\">private!</span>");
};return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileHeadingViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile;buf.push("<div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"cover-photo\"><div class=\"icon-bkgd headline-photo-icon\"><span id=\"edit-headline-image\" data-openmodal=\"headlinePhotoEdit\" class=\"ss-write edit-icon skill-element-icon\"></span></div><div class=\"headline-image-container\">");
if ( (profile.skills && profile.skills.length && profile.skills[0].skillHeadlinePhotoUrl))
{
buf.push("<img" + (jade.attrs({ 'src':(profile.skills[0].skillHeadlinePhotoUrl), "class": [('headline-photo')] }, {"src":true})) + "/>");
}
else
{
if ( (profile.profileType == 'business' || profile.profileType == 'venue'))
{
buf.push("<img src=\"images/placeholder_imgs/biz_headline_placeholder_edit.jpg\" class=\"headline-photo\"/>");
}
else if ( (profile.profileType == 'executive'))
{
buf.push("<img src=\"images/placeholder_imgs/exec_headline_placeholder_edit.jpg\" class=\"headline-photo\"/>");
}
else if ( (profile.profileType == 'behindthescenes'))
{
buf.push("<img src=\"images/placeholder_imgs/bts_headline_placeholder_edit.jpg\" class=\"headline-photo\"/>");
}
else
{
buf.push("<img src=\"images/placeholder_imgs/headline_placeholder.jpg\" class=\"headline-photo\"/>");
}
}
buf.push("</div></div></div></div><div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"sub-heading-nav\">");
if ( profile.profileType == 'business')
{
buf.push("<span class=\"skills-heading\">Services</span>");
}
else if ( profile.profileType == 'venue')
{
buf.push("<span class=\"skills-heading\">Venues</span>");
}
else
{
buf.push("<span class=\"skills-heading\">Skills</span>");
}
buf.push("<div class=\"skill-button-container\"><div class=\"skill-button add-skill\"><div id=\"add-skill\" data-openmodal=\"new-skill-modal\" class=\"ss-plus open-modal\"></div></div></div>");
if ( (profile.skills))
{
for (var x = 0; x < profile.skills.length; x++)
{
if ( x < 4)
{
buf.push("<div class=\"skill-button-container\"><div" + (jade.attrs({ 'data-skillid':(x), "class": [('skill-button'),('edit')] }, {"data-skillid":true})) + "><div class=\"skill-text\">" + (jade.escape(null == (jade.interp = profile.skills[x].skillType) ? "" : jade.interp)) + "</div><div class=\"inner\"></div></div></div>");
}
}
}
buf.push("</div></div><div id=\"skill-edit-modal\" class=\"editSkillModal popover\"><div class=\"deleteSkill-subtitle\">Rename Skill</div><input id=\"skill-type-edit\" data-placeholder=\"Select a skill type\" class=\"new-skill-name skill-select\"/><br/><br/><br/><div class=\"update-buttons\"><input id=\"delete-skill\" type=\"button\" value=\"Delete Skill\" data-openmodal=\"skill-delete-modal\" class=\"open-modal button-link\"/><input id=\"update-skill\" type=\"button\" value=\"Done\" class=\"button-alt greenbutton\"/><input type=\"button\" value=\"Cancel\" data-closemodal=\"skill-edit-modal\" class=\"button-link close-modal\"/></div></div><div id=\"prompt-user-to-publish\" class=\"golive popover\"><span class=\"smallprint\">Congratulations! This profile is over 50% complete.</span><br/><br/><input id=\"consentPublish\" type=\"button\" value=\"Publish now\" class=\"button-alt\"/><input id=\"declinePublish\" type=\"button\" value=\"Stay private\" class=\"button-alt\"/></div><div id=\"headlinePhotoEdit\" class=\"headline-area-edit popover\"><span data-closemodal=\"headlinePhotoEdit\" class=\"ss-delete close-modal\"></span><span id=\"headline-photo-edit-title\" class=\"profile-subtitle\">Edit Headline Image</span><br/><br/><div id=\"headlinePhotoPreview\"></div><div class=\"upload-buttons\"><input type=\"file\" id=\"headlineImgUpload\" accept=\"image/*\" class=\"headline-image-upload\"/></div><div class=\"update-buttons\"><input type=\"button\" value=\"Delete\" id=\"delete-headline-image\" class=\"button-link\"/><input type=\"button\" value=\"Upload\" id=\"upload-headline-image\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"headlinePhotoEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div><div id=\"new-skill-modal\" class=\"popover\"><div class=\"profile-subtitle\">Add a new skill</div><div class=\"new-skill-select\"><input id=\"skill-type-add\" data-placeholder=\"Select a skill type\" class=\"new-skill-name skill-select\"/></div><div class=\"update-buttons\"><input type=\"button\" value=\"Add\" class=\"button-alt greenbutton submit-new-skill\"/><input type=\"button\" value=\"Cancel\" data-closemodal=\"new-skill-modal\" class=\"button-link cancel-skill-creation  close-modal\"/></div></div></div><div class=\"row\"><div class=\"col-lg-2 hidden-md\"></div><div class=\"col-lg-2 col-md-3 hidden-sm hidden-xs attributes-placeholder\"></div><div class=\"title-area col-lg-6 col-md-9 col-sm-12\"><div class=\"skill-area\"></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileSkillButtonTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),editSkill = locals_.editSkill,skillId = locals_.skillId,skillName = locals_.skillName;if ( editSkill)
{
buf.push("<div" + (jade.attrs({ 'data-skillid':(skillId), "class": [('skill-button'),('edit'),('active')] }, {"data-skillid":true})) + "><div class=\"skill-text\">" + (jade.escape(null == (jade.interp = skillName) ? "" : jade.interp)) + "</div><span id=\"edit-skill-type\" data-openmodal=\"skill-edit-modal\" class=\"ss-write edit-icon open-modal\"></span><div class=\"inner\"></div></div>");
}
else
{
buf.push("<div" + (jade.attrs({ 'data-skillid':(skillId), "class": [('skill-button'),('edit')] }, {"data-skillid":true})) + "><div class=\"skill-text\">" + (jade.escape(null == (jade.interp = skillName) ? "" : jade.interp)) + "</div><div class=\"inner\"></div></div>");
};return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileSkillDocumentsTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div id=\"edit-document\"><span id=\"skill-document-edit-icon\" class=\"ss-write edit-icon skill-element-icon\"></span></div><div id=\"skill-document-slideshow\">");
if ((skill && skill.skillDocuments && skill.skillDocuments.length))
{
buf.push("<ul>");
for (var x = 0; x < skill.skillDocuments.length; x++)
{
buf.push("<li" + (jade.attrs({ 'data-index':(x), "class": [("document document-slide-"+x)] }, {"class":true,"data-index":true})) + "><div class=\"document-slide\"><img src=\"images/document.jpg\" class=\"document-slide\"/><div class=\"title\">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].title) ? "" : jade.interp)) + "</div><div class=\"description\">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].desc) ? "" : jade.interp)) + "</div><div class=\"download\"><a" + (jade.attrs({ 'href':(skill.skillDocuments[x].url), 'download':("document"), 'target':("makeitglobal_document"), "class": [('download')] }, {"href":true,"download":true,"target":true})) + ">");
if ( skill.skillDocuments[x].name && skill.skillDocuments[x].name.length)
{
buf.push(jade.escape(null == (jade.interp = skill.skillDocuments[x].name) ? "" : jade.interp));
}
else
{
buf.push("Download");
}
buf.push("</a></div></div></li>");
}
buf.push("</ul><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left document\"></div><div data-slideshow=\"next\" class=\"slide-navigate right document edit\"></div><div class=\"ss-navigateleft\"></div><div><ul>");
for (var x = 0; x < skill.skillDocuments.length; x++)
{
buf.push("<li" + (jade.attrs({ 'id':("document-title-"+x), "class": [("description document-slide-"+x)] }, {"id":true,"class":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].title) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></div><div><ul>");
for (var x = 0; x < skill.skillDocuments.length; x++)
{
buf.push("<li" + (jade.attrs({ 'id':("document-counter-"+x), "class": [("counter edit document-slide-"+x)] }, {"id":true,"class":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillDocuments.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></div><div class=\"ss-navigateright edit\"></div><div class=\"plus-border\"></div><div id=\"add-skill-document\" class=\"ss-plus document edit\"></div></div>");
}
else
{
buf.push("<ul><li class=\"document-slide-0 active\"><img src=\"images/placeholder_imgs/doc_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileSkillPhotosTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div class=\"edit-photo\"><span id=\"skill-photo-edit-icon\" class=\"ss-write edit-icon skill-element-icon\"></span></div><div id=\"skill-photo-slideshow\">");
if ((skill && skill.skillPhotos && skill.skillPhotos.length))
{
buf.push("<ul>");
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ 'data-index':(x), "class": [("photo photo-slide-"+x)] }, {"class":true,"data-index":true})) + "><img" + (jade.attrs({ 'src':(skill.skillPhotos[x].photoUrl) }, {"src":true})) + "/></li>");
}
buf.push("</ul><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left photo\"></div><div data-slideshow=\"next\" class=\"slide-navigate right photo edit\"></div><div class=\"ss-navigateleft\"></div><div><ul>");
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [("description photo-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillPhotos[x].photoDesc) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></div><div><ul>");
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [("counter edit photo-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillPhotos.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></div><div class=\"ss-navigateright edit\"></div><div class=\"plus-border\"></div><div id=\"add-skill-photo\" class=\"ss-plus edit photo\"></div></div>");
}
else
{
buf.push("<ul><li class=\"photo-slide-0 active\"><img src=\"images/placeholder_imgs/gallery_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileSkillVideosTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div class=\"edit-video\"><span id=\"skill-video-edit-icon\" data-openModal=\"skillVideoEdit\" class=\"ss-write edit-icon skill-element-icon\"></span></div><div id=\"skill-video-slideshow\">");
if ((skill && skill.skillVideo && skill.skillVideo.length))
{
buf.push("<div class=\"skill-video-area\"></div><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left video\"></div><div data-slideshow=\"next\" class=\"slide-navigate right video edit\"></div><span class=\"ss-navigateleft\"></span><span><ul>");
for (var x = 0; x < skill.skillVideo.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [('description'),("video-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillVideo[x].description) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></span><span><ul>");
for (var x = 0; x < skill.skillVideo.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [("counter edit video-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillVideo.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></span><span class=\"ss-navigateright edit\"></span><span class=\"plus-border\"></span><span id=\"add-skill-video\" class=\"ss-plus edit photo\"></span></div>");
}
else
{
buf.push("<ul><li class=\"video-slide-0 active\"><img src=\"images/placeholder_imgs/video_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileSkillViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill,Mi = locals_.Mi,profileType = locals_.profileType;buf.push("<div class=\"profile-subtitle\">Summary<div id=\"skill-summary-icon\" data-openmodal=\"skillSummaryEdit\" class=\"ss-write edit-icon open-modal\"></div><div id=\"profile-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">Are you sure want to delete this profile?</span><br/><br/><input type=\"button\" id=\"delete-profile-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"profile-delete-modal\" class=\"confirm-delete-button close-modal\"/></div><div id=\"skill-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">Are you sure you want to delete this skill?</span><br/><br/><input type=\"button\" id=\"delete-skill-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"skill-delete-modal\" class=\"confirm-delete-button close-modal\"/></div></div><div class=\"skill-summary\"><div id=\"summary-display\" class=\"summary-textbox\">");
if ( skill.skillSummary)
{
buf.push(jade.escape(null == (jade.interp = skill.skillSummary) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = Mi.CMS[profileType].summary_placeholder) ? "" : jade.interp));
}
buf.push("</div><div id=\"skillSummaryEdit\" class=\"skill-summary-edit popover\"><span data-closemodal=\"skillSummaryEdit\" class=\"ss-delete close-modal\"></span><div class=\"profile-subtitle summary-title-edit\">Edit Summary</div><textarea data-skillsummary=\"content\" resize=\"no\" placeholder=\"Enter summary\" class=\"summary-textarea summary-textbox\">");
if ( skill.skillSummary)
{
buf.push(jade.escape(null == (jade.interp = skill.skillSummary) ? "" : jade.interp));
}
buf.push("</textarea><div class=\"update-buttons\"><input type=\"button\" value=\"Done\" id=\"save-skill-summary\" class=\"button-alt greenbutton marginright30\"/><input type=\"button\" data-closemodal=\"skillSummaryEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div></div><div class=\"skill-element-container\"><div class=\"tab-navigation\"><div data-tabnav=\"docs\" class=\"tab-button\">Documents<div class=\"inner\"></div></div><div data-tabnav=\"videos\" class=\"tab-button\">Videos<div class=\"inner\"></div></div><div data-tabnav=\"photos\" class=\"tab-button active\">Photos<div class=\"inner\"></div></div></div><!-- - skill photo tab/slidewhow--><div id=\"photos-tab\" class=\"tab-element active\"></div><div id=\"videos-tab\" class=\"tab-element\"></div><div id=\"skillVideoEdit\" class=\"skill-video-edit popover\"><div data-closemodal=\"skillVideoEdit\" class=\"ss-delete close-modal\"></div><div id=\"video-edit-title\" class=\"profile-subtitle\">YouTube or Vimeo video url for this skill</div><input id=\"video_url_edit\" type=\"text\" placeholder=\"Add your video url (YouTube or Vimeo)\" style=\"width: 100%\" class=\"primary-input youtube-url-input\"/><br/><br/><br/><div class=\"profile-subtitle\">Give this video a short description</div><input id=\"video_description_edit\" type=\"text\" placeholder=\"Add a description (up to 70 characters)\" maxlength=\"70\" style=\"width: 100%\" class=\"primary-input\"/><div class=\"update-buttons\"><input type=\"button\" value=\"Delete\" id=\"delete-skill-video\" class=\"button-link\"/><input type=\"button\" value=\"Save\" id=\"save-skill-video\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"skillVideoEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div><div id=\"skill-video-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">Are you sure want to delete this video?</span><br/><br/><input type=\"button\" id=\"delete-skill-video-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"skill-video-delete-modal\" class=\"confirm-delete-button close-modal\"/></div><div id=\"documents-tab\" class=\"tab-element\"></div><div id=\"skill-document-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">Are you sure want to delete this document?</span><br/><br/><input type=\"button\" id=\"delete-skill-document-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"skill-document-delete-modal\" class=\"confirm-delete-button close-modal\"/></div><div id=\"skillDocumentEdit\" class=\"skill-document-edit popover\"><span data-closemodal=\"skillDocumentEdit\" class=\"ss-delete close-modal\"></span><div id=\"document-edit-title\" class=\"profile-subtitle\">Edit the title and description of this document or choose a new file to upload. PDF only please.</div><input type=\"text\" placeholder=\"Document Title (up to 30 characters)\" maxlength=\"30\" class=\"skill-document-title primary-input\"/><br/><textarea type=\"text\" maxlength=\"500\" placeholder=\"Detailed description (up to 500 characters)\" class=\"skill-document-desc\"></textarea><div class=\"upload-buttons\"><input type=\"file\" id=\"skillDocUpload\" accept=\"application/pdf\"/></div><div class=\"update-buttons\"><input type=\"button\" value=\"Delete\" id=\"delete-skill-document\" class=\"button-link\"/><input type=\"button\" value=\"Save\" id=\"save-skill-document\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"skillDocumentEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div><div id=\"skill-photo-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">Are you sure want to delete this photo?</span><br/><br/><input type=\"button\" id=\"delete-skill-photo-confirm\" value=\"Yes\" class=\"confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"skill-photo-delete-modal\" class=\"confirm-delete-button close-modal\"/></div><div id=\"skillPhotoEdit\" class=\"skill-photo-edit popover\"><span data-closemodal=\"skillPhotoEdit\" class=\"ss-delete close-modal\"></span><span id=\"photo-edit-title\" class=\"profile-subtitle\">Photo for this skill</span><div class=\"skill-photo-preview\"><div id=\"skillPicturePreview\"><div class=\"filler\"></div></div></div><div class=\"upload-buttons\"><input type=\"file\" id=\"skillImgUpload\" accept=\"image/*\" class=\"skill-image-upload\"/></div><span class=\"profile-subtitle\">Description of photo</span><input id=\"photo-upload-desc\" type=\"text\" placeholder=\"Add a description (up to 30 characters)\" maxlength=\"30\" class=\"skill-photo\"/><div class=\"update-buttons\"><input type=\"button\" value=\"Delete\" id=\"delete-skill-photo\" class=\"button-link\"/><input type=\"button\" value=\"Save\" id=\"save-skill-photo\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"skillPhotoEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileTitleOrgs"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),orgs = locals_.orgs;if ( (orgs.length > 0))
{
for (var x = 0; x < orgs.length; x++)
{
if ( (x == orgs.length - 1))
{
buf.push(jade.escape(null == (jade.interp = orgs[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = orgs[x] + "/") ? "" : jade.interp));
}
}
};return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileTitleTags"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile;buf.push("<a class=\"title\">Tags:&nbsp;</a>");
if ( (profile.tags.length > 0))
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( (x == profile.tags.length - 1))
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
};return buf.join("");
};

this["JST"]["app/scripts/templates/profile/editProfile/profileTitleViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile;buf.push("<div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"milestone-bar\"><div id=\"editor-title\" class=\"left-title\">");
switch (profile.profileType){
case "_3d_printing":
buf.push("3D Printing Profile Editor");
  break;
case "injection_molding":
buf.push("Injection Molding Profile Editor");
  break;
case "metal_die_casting":
buf.push("Metal Die Castin Profile Editor");
  break;
case "cnc_machining":
buf.push("CNC Machining Profile Editor");
  break;
case "other":
buf.push("Other Services Profile Editor");
  break;
default:
buf.push("Profile Editor");
  break;
}
buf.push("</div><div class=\"right-progress-bar-container\"><div class=\"progress-bar\"></div><div class=\"progress-text\"><span class=\"percentage-complete\">0</span>% complete</div></div><div id=\"publish-status\" class=\"hidden-xs\"></div></div></div></div><div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"title-content\"><div class=\"left-title edit\"><span class=\"title-name\">");
if ( profile.profileName && profile.profileName.length)
{
buf.push(jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp));
}
else
{
buf.push("Profile name");
}
buf.push("</span>&nbsp;<span class=\"title-orgs\">");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications.length == 0)
{
buf.push("Certifications");
for (var x = 0; x < profile.certifications.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.certifications[x]) ? "" : jade.interp));
if ( (x < profile.certifications.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
else
{
if ( profile.organizations && profile.organizations.length == 0)
{
buf.push("Equity/Union");
for (var x = 0; x < profile.organizations.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
if ( (x < profile.organizations.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
buf.push("</span><span data-toggle=\"tooltip\" data-openmodal=\"titleSectionEdit\" class=\"ss-write edit-icon title-section-icon open-modal\"></span></div><div class=\"user-tags hidden-xs\"><span class=\"title\">Tags:&nbsp;</span>");
if ( profile.tags && profile.tags.length > 0)
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( (x == profile.tags.length - 1))
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
}
buf.push("</div><div class=\"right-title\"><div class=\"contact-links\"><input type=\"button\" id=\"contact-profile-edit\" value=\"Contact/Share\" data-openmodal=\"contact-edit-modal\" class=\"contact-button button-alt core-button open-modal\"/><div data-toggle=\"tooltip\" data-openmodal=\"contact-edit-modal\" class=\"ss-write edit-icon contact-edit-icon contact-edit position open-modal\"></div></div></div></div><div id=\"contact-edit-modal\" class=\"popover contactinput\"><span data-closemodal=\"contact-edit-modal\" class=\"ss-delete close-modal\"></span><input type=\"button\" id=\"contact-done\" value=\"Done\" class=\"close-modal contact-done button-alt\"/><div class=\"contactemail profile-title\">Edit Profile Settings for &nbsp;" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</div><div class=\"contact-subtitle\">Contact Email</div><div class=\"contact-right\"><input" + (jade.attrs({ 'type':("text"), 'placeholder':("example@email.com"), 'id':("prof-email"), 'value':(profile.profileContactEmail), "class": [("contactbox")] }, {"class":true,"type":true,"placeholder":true,"id":true,"value":true})) + "/></div><div class=\"contact-subtitle\">Privacy</div><div class=\"contact-right\"><select data-placeholder=\"Private or Public?\" id=\"prof-privacy\" style=\"width: 350px;\" class=\"privacy-select contactbox\">");
if ( profile.profilePublished)
{
buf.push("<option>Private</option><option selected=\"selected\">Public</option>");
}
else
{
buf.push("<option selected=\"selected\">Private</option><option>Public</option>");
}
buf.push("</select></div><div class=\"contact-subtitle\">Profile URL</div><div class=\"contact-right\">");
if ( (profile.profileCustomUrl && profile.profileCustomUrl.length))
{
buf.push("<input" + (jade.attrs({ 'type':("text"), 'placeholder':("Create custom profile address"), 'id':("prof-url"), 'value':(decodeURIComponent(profile.profileCustomUrl)), "class": [("contactbox")] }, {"class":true,"type":true,"placeholder":true,"id":true,"value":true})) + "/>");
}
else
{
buf.push("<input type=\"text\" placeholder=\"Create custom profile address\" id=\"prof-url\" class=\"contactbox\"/>");
}
buf.push("</div><div class=\"contact-subtitle final-url\">");
if ( (profile.profileCustomUrl && profile.profileCustomUrl.length))
{
buf.push("www.across-mold.com/#/" + (jade.escape(null == (jade.interp = profile.profileCustomUrl) ? "" : jade.interp)));
}
else
{
buf.push("www.across-mold.com/#/customUrl");
}
buf.push("</div><input type=\"button\" value=\"Delete this profile\" data-openmodal=\"profile-delete-modal\" class=\"button-link open-modal\"/></div></div><div id=\"profile-delete-modal\" class=\"confirm-delete popover\"><span class=\"confirm-delete-subtitle\">" + (jade.escape(null == (jade.interp = "Are you sure you want to delete the ") ? "" : jade.interp)) + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + (jade.escape(null == (jade.interp = " profile for ") ? "" : jade.interp)) + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + (jade.escape(null == (jade.interp = "?") ? "" : jade.interp)) + "</span><br/><br/><input type=\"button\" id=\"delete-profile-confirm\" value=\"Yes\" class=\"button-alt core-button confirm-delete-button\"/><input type=\"button\" value=\"No\" data-closemodal=\"profile-delete-modal\" class=\"button-alt core-button confirm-delete-button close-modal\"/></div><div id=\"titleSectionEdit\" class=\"popover title-area-edit\"><div class=\"title-edit-top\"><span data-closemodal=\"titleSectionEdit\" class=\"ss-delete close-modal\"></span><div class=\"editing-title\">Edit Header Information</div><br/><div class=\"editing-subtitle\">");
if ( (profile.profileType == "business" || profile.profileType == "venue"))
{
buf.push("Add your certifications, and add tags to your profile.");
}
else
{
buf.push("Add your equity or union, and add tags to your profile.");
}
buf.push("</div></div><br/><div class=\"title-edit-top\"><div class=\"editing-title\">Profile Name</div><input" + (jade.attrs({ 'type':("text"), 'maxlength':(35), 'placeholder':("Enter name for this profile"), 'value':(profile.profileName), "class": [('edit-profile-name')] }, {"type":true,"maxlength":true,"placeholder":true,"value":true})) + "/></div><hr/><div class=\"title-edit-mid-left\"><div class=\"editing-title\">Tags</div><br/><div class=\"editing-subtitle\">Tags help other users find your profile.</div><textarea data-placeholder=\"Enter some tags\" multiple=\"multiple\" class=\"chosen-select tags-select\"></textarea></div><div class=\"title-edit-mid-right\">");
if ( (profile.profileType == "business" || profile.profileType == "venue"))
{
buf.push("<div class=\"editing-title\">Certifications</div><br/><div class=\"editing-subtitle\">No certifications? Leave this area blank and it won't show up on your profile.</div><textarea data-placeholder=\"Choose your certifications\" multiple=\"multiple\" class=\"chosen-select certification-select\"></textarea>");
}
else
{
buf.push("<div class=\"editing-title\">Equity/Union</div><br/><div class=\"editing-subtitle\">Aren't part of one? Leave this area blank and it won't show up on your profile.</div><textarea data-placeholder=\"Choose your equity\" multiple=\"multiple\" class=\"chosen-select equity-union-select\"></textarea>");
}
buf.push("</div><div class=\"title-save-buttons\"><input type=\"button\" value=\"Done\" id=\"save-title-info\" class=\"button-alt greenbutton\"/><input type=\"button\" data-closemodal=\"titleSectionEdit\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/modals/modal-profileEdits"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile;buf.push("<div id=\"profileModals\"><div id=\"welcome-modal\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><div class=\"profile-subtitle\">");
switch (profile.profileType){
case "_3d_printing":
buf.push("3D Printing Profile Editor");
  break;
case "injection_molding":
buf.push("Injection_molding Profile Editor");
  break;
case "metal_die_casting":
buf.push("Metal Die Casting Profile Editor");
  break;
case "cnc_machining":
buf.push("CNC Machining Profile Editor");
  break;
case "other":
buf.push("Other Services Profile Editor");
  break;
}
buf.push("</div><br/><span class=\"profile-caption\">What do you want this profile to be called?</span><br/><input type=\"text\" id=\"profileName\" placeholder=\"stage name, band name, real name\" class=\"primary-input, new-profile-input\"/>");
if ( profile.profileType == "_3d_printing")
{
buf.push("<span id=\"skill-select-label\" class=\"profile-caption\">Add the first 3D Printing Service.</span><input id=\"skill-select\" style=\"width: 350px;\" data-placeholder=\"Select a 3D Printing service\" name=\"prof-edit-drop\" class=\"chosen-skill-select skill-select\"/>");
}
else if ( profile.profileType == "injection_molding")
{
buf.push("<span id=\"skill-select-label\" class=\"profile-caption\">Add your first Injection Molding Service.</span><input id=\"skill-select\" style=\"width: 350px;\" data-placeholder=\"Select an Injection Molding service\" name=\"prof-edit-drop\" class=\"chosen-skill-select skill-select\"/>");
}
else if ( profile.profileType == "metal_die_casting")
{
buf.push("<span id=\"skill-select-label\" class=\"profile-caption\">Add your first Metal Die Casting Service.</span><input id=\"skill-select\" style=\"width: 350px;\" data-placeholder=\"Select an Metal Die Casting service\" name=\"prof-edit-drop\" class=\"chosen-skill-select skill-select\"/>");
}
else if ( profile.profileType == "cnc_machining")
{
buf.push("<span id=\"skill-select-label\" class=\"profile-caption\">Add your first CNC Machining Service.</span><input id=\"skill-select\" style=\"width: 350px;\" data-placeholder=\"Select a CNC Machining service\" name=\"prof-edit-drop\" class=\"chosen-skill-select skill-select\"/>");
}
else
{
buf.push("<span class=\"profile-caption\">Add your first service.</span><input id=\"skill-select\" style=\"width: 350px;\" data-placeholder=\"Select a service\" name=\"prof-edit-drop\" class=\"chosen-skill-select skill-select\"/>");
}
buf.push("</div><div class=\"modal-footer\"><div class=\"profile-caption\">To edit this profile, click on the various pencils.</div><input type=\"button\" id=\"saveProfileBasics\" value=\"Continue &gt;&gt;\" class=\"skill-continue-button\"/></div></div></div></div><div id=\"addskillmodal\" class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\">×</button><h4 class=\"modal-title\">Add a skill!</h4></div><div class=\"modal-body\"><span class=\"edit-label\">skill Name</span><br/><input type=\"text\" class=\"primary-input\"/><br/><span class=\"edit-label\">skill summary</span><br/><textarea class=\"skill-summary-input\"></textarea></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">Close</button><button type=\"button\" class=\"btn btn-primary\">Save changes</button></div></div></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileAttributesViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,key = locals_.key,Mi = locals_.Mi;buf.push("<div class=\"attributes-area\"><div class=\"attributes-features\">");
var photoUrl = "images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
photoUrl = profile.profilePictureUrl
}
buf.push("<div" + (jade.attrs({ 'style':("background:url('"+ photoUrl +"')"), "class": [('attributes-photo')] }, {"style":true})) + "></div>");
if ( (profile.profileFeatures))
{
var featureCt = 0
for(key in Mi.CMS[profile.profileType].attributes)
{
if ( (profile.profileFeatures[key] && profile.profileFeatures[key].length))
{
featureCt++
}
}
if ( (featureCt>0))
{
buf.push("<div class=\"profile-subtitle\">Features</div><div class=\"profile-features-area\"><ul>");
for(key in Mi.CMS[profile.profileType].attributes)
{
var value = profile.profileFeatures[key] ? profile.profileFeatures[key] : ''
if ( value && value.length)
{
buf.push("<li>" + (jade.escape(null == (jade.interp = Mi.CMS.labels[key] + ": " + value) ? "" : jade.interp)) + "</li>");
}
}
buf.push("</ul></div>");
}
}
buf.push("</div><div class=\"attributes-location\">");
if ( (profile.latlng))
{
buf.push("<div class=\"profile-subtitle\">Location</div><div class=\"location-container\"><div id=\"location-map\" class=\"location-map\"></div></div>");
}
buf.push("</div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileHeadingViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile;var skills = profile.skills
var initSkill = skills && skills.length ? skills[0] : null
buf.push("<div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"cover-photo\"><div class=\"headline-image-container\">");
if ( initSkill)
{
buf.push("<img" + (jade.attrs({ 'src':(initSkill.skillHeadlinePhotoUrl), "class": [('headline-photo')] }, {"src":true})) + "/>");
}
else
{
buf.push("<img src=\"images/placeholder_imgs/headline_placeholder.jpg\" class=\"headline-photo\"/>");
}
buf.push("</div></div></div></div><div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"sub-heading-nav\"><span class=\"skills-heading\">Services</span>");
for (var x = 0; x < skills.length; x++)
{
if ( x < 4)
{
buf.push("<div class=\"skill-button-container\"><div" + (jade.attrs({ 'data-skillid':(x), "class": [('skill-button')] }, {"data-skillid":true})) + "><div class=\"skill-text\">" + (jade.escape(null == (jade.interp = profile.skills[x].skillType) ? "" : jade.interp)) + "</div><div class=\"inner\"></div></div></div>");
}
}
buf.push("</div></div></div><div class=\"row\"><div class=\"col-lg-2 hidden-md\"></div><div class=\"col-lg-2 col-md-3 hidden-sm hidden-xs attributes-placeholder\"></div><div class=\"title-area col-lg-6 col-md-9 col-sm-12 col-xs-12\"><div class=\"skill-area\"><h1>LOADING...</h1></div></div></div><div class=\"visible-xs row\"><div class=\"contact-links\"><div id=\"share-modal\" data-toggle=\"tooltip\" class=\"profile-action-button\"><img src=\"images/share_button.png\"/><div class=\"label\">Share</div></div><div id=\"save-profile\" data-toggle=\"tooltip\" class=\"profile-action-button\"><img src=\"images/favorite_button.png\"/><div class=\"label\">Favorite</div></div><a id=\"contact-email\"><div id=\"contact-profile\" data-toggle=\"tooltip\" class=\"profile-action-button\"><img src=\"images/contact_button.png\"/><div class=\"label\">Contact</div></div></a></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileSkillDocumentsTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div id=\"skill-document-slideshow\">");
if ((skill && skill.skillDocuments && skill.skillDocuments.length))
{
buf.push("<ul>");
for (var x = 0; x < skill.skillDocuments.length; x++)
{
buf.push("<li" + (jade.attrs({ 'data-index':(x), "class": [("document document-slide-"+x)] }, {"class":true,"data-index":true})) + "><div class=\"document-slide\"><img src=\"images/document.jpg\" class=\"document-slide\"/><div class=\"title\">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].title) ? "" : jade.interp)) + "</div><div class=\"description\">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].desc) ? "" : jade.interp)) + "</div><div class=\"download\"><a" + (jade.attrs({ 'href':(skill.skillDocuments[x].url), 'target':("makeitglobal_document"), "class": [('download')] }, {"href":true,"target":true})) + ">Download</a></div></div></li>");
}
buf.push("</ul><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left document\"></div><div data-slideshow=\"next\" class=\"slide-navigate right document\"></div><span class=\"ss-navigateleft\"></span><span><ul>");
for (var x = 0; x < skill.skillDocuments.length; x++)
{
buf.push("<li" + (jade.attrs({ 'id':("document-title-"+x), "class": [('description'),("document-slide-"+x)] }, {"class":true,"id":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillDocuments[x].title) ? "" : jade.interp)) + "</li><li" + (jade.attrs({ 'id':("document-counter-"+x), "class": [('counter'),("document-slide-"+x)] }, {"class":true,"id":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillDocuments.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></span><span class=\"ss-navigateright\"></span></div>");
}
else
{
buf.push("<ul><li class=\"document-slide-0 active\"><img src=\"images/placeholder_imgs/doc_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileSkillPhotosTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div id=\"skill-photo-slideshow\">");
if ((skill && skill.skillPhotos && skill.skillPhotos.length))
{
buf.push("<ul>");
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [("photo-slide-"+x)] }, {"class":true})) + "><img" + (jade.attrs({ 'src':(skill.skillPhotos[x].photoUrl) }, {"src":true})) + "/></li>");
}
buf.push("</ul><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left photo\"></div><div data-slideshow=\"next\" class=\"slide-navigate right photo\"></div><div class=\"ss-navigateleft\"></div><div><ul>");
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [('description'),("photo-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillPhotos[x].photoDesc) ? "" : jade.interp)) + "</li>");
}
for (var x = 0; x < skill.skillPhotos.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [('counter'),("photo-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillPhotos.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></div><div class=\"ss-navigateright\"></div></div>");
}
else
{
buf.push("<ul><li class=\"photo-slide-0 active\"><img src=\"images/placeholder_imgs/gallery_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileSkillVideosTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill;buf.push("<div id=\"skill-video-slideshow\">");
if ((skill && skill.skillVideo && skill.skillVideo.length))
{
buf.push("<div class=\"skill-video-area\"></div><div class=\"skill-slideshow-subnav\"><div data-slideshow=\"prev\" class=\"slide-navigate left video\"></div><div data-slideshow=\"next\" class=\"slide-navigate right video\"></div><span class=\"ss-navigateleft\"></span><span><ul>");
for (var x = 0; x < skill.skillVideo.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [('description'),("video-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = skill.skillVideo[x].description) ? "" : jade.interp)) + "</li>");
}
for (var x = 0; x < skill.skillVideo.length; x++)
{
buf.push("<li" + (jade.attrs({ "class": [('counter'),("video-slide-"+x)] }, {"class":true})) + ">" + (jade.escape(null == (jade.interp = (x + 1) +" of " + skill.skillVideo.length) ? "" : jade.interp)) + "</li>");
}
buf.push("</ul></span><span class=\"ss-navigateright\"></span></div>");
}
else
{
buf.push("<ul><li class=\"video-slide-0 active\"><img src=\"images/placeholder_imgs/video_placeholder.jpg\" id=\"slide-placeholder\" style=\"display: block;\"/></li></ul>");
}
buf.push("</div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileSkillViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),skill = locals_.skill,profile = locals_.profile;buf.push("<div class=\"profile-subtitle\">Summary</div><div id=\"summary-display\" class=\"skill-summary view\">");
if ( (skill.skillSummary))
{
buf.push(jade.escape(null == (jade.interp = skill.skillSummary) ? "" : jade.interp));
}
else
{
buf.push("This service has no summary.");
}
buf.push("</div><div class=\"visible-xs visible-sm\"><div class=\"profile-subtitle\">Location<div class=\"portrait-location\"><a" + (jade.attrs({ 'href':(profile.location_google), 'target':("_empty") }, {"href":true,"target":true})) + ">" + (jade.escape(null == (jade.interp = profile.location) ? "" : jade.interp)) + "</a></div></div></div><div class=\"skill-element-container\"><div class=\"tab-navigation\"><div data-tabnav=\"docs\" class=\"tab-button\">Documents<div class=\"inner\"></div></div><div data-tabnav=\"videos\" class=\"tab-button\">Videos<div class=\"inner\"></div></div><div data-tabnav=\"photos\" class=\"tab-button active\">Photos<div class=\"inner\"></div></div></div><div id=\"photos-tab\" class=\"tab-element active\"></div><div id=\"videos-tab\" class=\"tab-element\"></div><div id=\"documents-tab\" class=\"tab-element\"></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/profile/viewProfile/profileTitleViewTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,profileId = locals_.profileId,tagsearch = locals_.tagsearch;var profileUrl = profile.profileCustomUrl
if ( profileUrl && profileUrl.length)
{
profileUrl = encodeURIComponent("www.across-mold.com/#/" + profileUrl)
}
else
{
profileUrl = encodeURIComponent("www.across-mold.com/#/display-profile/"+profileId)
}
buf.push("<div class=\"row\"><div class=\"col-lg-2 col-md-0\"></div><div class=\"title-area col-lg-8 col-md-12\"><div class=\"title-content\"><div class=\"col-12 left-title\"><span class=\"title-name\">");
if ( profile.profileName && profile.profileName.length)
{
buf.push(jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp));
}
else
{
buf.push("No profile name");
}
buf.push("&nbsp;</span><span class=\"title-orgs\">");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications)
{
for (var x = 0; x < profile.certifications.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.certifications[x]) ? "" : jade.interp));
if ( (x < profile.certifications.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
else
{
if ( profile.organizations)
{
for (var x = 0; x < profile.organizations.length; x++)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
if ( (x < profile.organizations.length-1))
{
buf.push(jade.escape(null == (jade.interp = "/") ? "" : jade.interp));
}
}
}
}
buf.push("</span></div><div class=\"col-8 col-xs-12 user-tags\"><span class=\"title\">Tags:&nbsp;</span>");
if ( (profile.tags.length > 0))
{
for (var x = 0; x < profile.tags.length; x++)
{
tagsearch = "#/search/q/" + profile.tags[x]
buf.push("<a" + (jade.attrs({ 'href':(tagsearch) }, {"href":true})) + ">" + (jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp)) + "</a>");
if ( (x < profile.tags.length - 1))
{
buf.push(",&nbsp;");
}
}
}
buf.push("</div><div class=\"col-2 hidden-xs right-title\"><div class=\"contact-links\"><div id=\"share-modal\" data-toggle=\"tooltip\" class=\"profile-action-button\"><img src=\"images/share_button.png\"/><div class=\"label\">Share</div></div><div id=\"save-profile\" data-toggle=\"tooltip\" class=\"profile-action-button\"><img src=\"images/favorite_button.png\"/><div class=\"label\">Favorite</div></div><div id=\"contact-profile\" data-toggle=\"tooltip\" class=\"profile-action-button\"><a id=\"contact-email\"><img src=\"images/contact_button.png\"/><div class=\"label\">Contact</div></a></div></div></div></div></div></div><div class=\"popover share-profile-modal\"><span id=\"hide-share-modal\" class=\"ss-delete close-modal\"></span><span id=\"hide-share-modal\" class=\"title-name\">Share</span><div id=\"share-divide\"><div id=\"share-divide-orange\"></div></div><div id=\"share-sub-left\"><div" + (jade.attrs({ 'id':("profile-summary-"+profileId), "class": [('profile-left')] }, {"id":true})) + ">");
var profileImgUrl="images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
profileImgUrl=profile.profilePictureUrl
}
buf.push("<div" + (jade.attrs({ 'style':("background:url('" + profileImgUrl + "')"), "class": [('profile-image')] }, {"style":true})) + "></div></div></div><div id=\"share-sub-right\"><span class=\"title-name\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "<br/></span><span id=\"share-text\" class=\"title-orgs\">" + (jade.escape(null == (jade.interp = profile.profileType) ? "" : jade.interp)) + "</span></div><div id=\"share-divide-2\"></div><div id=\"social-icons\">Share<br/><a id=\"fb-share\"><img id=\"imgopacity\" src=\"images/social_icons/facebook.png\"/></a><a" + (jade.attrs({ 'href':("http://twitter.com/share?url=&text=Check out who's on Across Mold! " + profileUrl +"&hashtags=AcrossMold"), 'target':("_blank") }, {"href":true,"target":true})) + "><img id=\"imgopacity\" src=\"images/social_icons/twitter.png\"/></a><a" + (jade.attrs({ 'href':("mailto:?subject=Check out who%27s on Across Mold!&body=" + profileUrl) }, {"href":true})) + "><img id=\"imgopacity\" src=\"images/social_icons/mail.png\"/></a><input" + (jade.attrs({ 'type':("text"), 'id':("share-url"), 'value':(decodeURIComponent(profileUrl)) }, {"type":true,"id":true,"value":true})) + "/></div><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/quotation/quotationTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),contactName = locals_.contactName,contactEmail = locals_.contactEmail,companyName = locals_.companyName,jobTitle = locals_.jobTitle,jobDescription = locals_.jobDescription;buf.push("<div id=\"edit-quotation\" class=\"row col-xs-12 col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1\"><br/><div class=\"row\"><div class=\"heading col-xs-offset-1 col-xs-10\">Get a quotation</div></div><div class=\"row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Your name</div><input" + (jade.attrs({ 'id':('quote_contact_name'), 'type':("text"), 'placeholder':("your name (required)"), 'value':(contactName), "class": [('col-xs-8'),('col-sm-6'),('col-md-4'),("settings personname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">E-mail</div><input" + (jade.attrs({ 'id':('quote_email'), 'type':("email"), 'placeholder':("email address (required)"), 'value':(contactEmail), "class": [('col-xs-8'),('col-sm-6'),('col-md-4'),("settings email")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Company</div><input" + (jade.attrs({ 'id':('quote_company_name'), 'type':("text"), 'placeholder':("company name"), 'value':(companyName), "class": [('col-xs-8'),('col-sm-6'),('col-md-4'),("settings companyname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"row\"><div class=\"editing-subtitle col-xs-2 col-xs-offset-1\">Job Name</div><input" + (jade.attrs({ 'id':('quote_job_name'), 'type':("text"), 'placeholder':("enter a job name or title"), 'value':(jobTitle), "class": [('col-xs-8'),("settings jobname")] }, {"class":true,"type":true,"placeholder":true,"value":true})) + "/></div><div class=\"row\"><div class=\"editing-subtitle col-xs-10 col-xs-offset-1\">Job Description</div><textarea" + (jade.attrs({ 'id':('quote_job_details'), 'resize':("vertical"), 'type':("text"), 'rows':("10"), 'placeholder':("enter a detailed job description (required)"), 'value':(jobDescription), "class": [('col-xs-10'),('col-xs-offset-1'),("settings jobdetails")] }, {"class":true,"resize":true,"type":true,"rows":true,"placeholder":true,"value":true})) + "></textarea></div><br/><br/><div class=\"row\"><div class=\"editing-subtitle col-md-9 col-md-offset-1 visible-md visible-lg\">Attachments - design documents, CAD drawings, supporting material, etc. (limit 25Mb)</div><div class=\"editing-subtitle col-sm-9 col-sm-offset-1 visible-sm\">Attachments - design documents, CAD drawings, etc. (limit 25Mb)</div><div class=\"editing-subtitle col-xs-8 col-xs-offset-1 visible-xs\">Attachments (limit 25mb)</div><div id=\"quote-attachments\" placeholder=\"No Attachments\" class=\"row col-xs-10 col-xs-offset-1\"><div id=\"quotation_file_btn\" class=\"action-btn\">Add file</div><form><input id=\"quotation_file\" type=\"file\" accept=\"*\" class=\"quotation-upload\"/></form></div></div><br/><br/><div class=\"row update-buttons\"><input id=\"quote-submit\" type=\"button\" value=\"Send\" class=\"visible-xs button-alt greenbutton\"/><input id=\"quote-submit\" type=\"button\" value=\"Send Request\" class=\"hidden-xs button-alt greenbutton\"/><input id=\"quote-cancel\" type=\"button\" data-closemodal=\"account-settings-modal\" value=\"Cancel\" class=\"button-link close-modal\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/registration/registrationChooseProfileTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),Mi = locals_.Mi;buf.push("<div class=\"registration-page-3\"><h1>Select your profile type</h1><div class=\"profile-selection-container\"><div class=\"profile-selection-buttons\"><button id=\"select-3d-printing\" data-profiletype=\"_3d_printing\" class=\"profile-button selected-profile\">3D Printing</button><button id=\"select-injection-molding\" data-profiletype=\"injection_molding\" class=\"profile-button\">Injection Molding</button><button id=\"select-metal-die-casting\" data-profiletype=\"metal_die_casting\" class=\"profile-button\">Metal Die Casting</button><button id=\"select-cnc-machining\" data-profiletype=\"cnc_machining\" class=\"profile-button\">CNC Machining</button><button id=\"select-other\" data-profiletype=\"other\" class=\"profile-button\">Other</button></div>");
// iterate Mi.CMS.profile_desc
;(function(){
  var $$obj = Mi.CMS.profile_desc;
  if ('number' == typeof $$obj.length) {

    for (var val = 0, $$l = $$obj.length; val < $$l; val++) {
      var index = $$obj[val];

buf.push("<div" + (jade.attrs({ 'id':(val+"-desc"), "class": [('profile-selection-desc')] }, {"id":true})) + ">" + (jade.escape(null == (jade.interp = index) ? "" : jade.interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var val in $$obj) {
      $$l++;      var index = $$obj[val];

buf.push("<div" + (jade.attrs({ 'id':(val+"-desc"), "class": [('profile-selection-desc')] }, {"id":true})) + ">" + (jade.escape(null == (jade.interp = index) ? "" : jade.interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div><div class=\"continue-button-section\"><span class=\"red-text\">You can add another profile type later</span><input type=\"button\" id=\"submit-registration-3\" value=\"Continue &gt;&gt;\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/registration/registrationConfirmMobileTemplate"] = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"registration-confirm-mobile\"><div class=\"registration-form-1\"><p>Thank you for creating your Make It Globalaccount.</p><br/><p>You can now use all search and share functions on Across Mold.</p><br/><p>To create and edit your own profile, please login via desktop or laptop computer</p><br/><p>Sorry, mobiles are just too small. :-)</p></div><br/><input type=\"button\" id=\"start-search\" value=\"Search\" class=\"registration-button\"/></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/registration/registrationLogInTemplate"] = function anonymous(locals) {
var buf = [];
buf.push("<h1>Registration Log in view<div class=\"email-pass-inputs\"><h2>Account</h2><input type=\"email\" placeholder=\"Email\" id=\"login-email\" class=\"email-input\"/><input type=\"password\" placeholder=\"Password\" id=\"login-password\" class=\"password-input\"/></div></h1><input type=\"button\" id=\"submit-login\" value=\"Login\" class=\"search-button button\"/>");;return buf.join("");
};

this["JST"]["app/scripts/templates/registration/registrationSignUpTemplate"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"registration-page-1\"><h1>Please create a Supplier account</h1><div><div class=\"registration-form-1\"><div class=\"name-inputs\"><h2>Name</h2><input type=\"text\" placeholder=\"First name\" class=\"first-name-input\"/>&nbsp;&nbsp;&nbsp;<span class=\"ss-plus\"></span>&nbsp;&nbsp;&nbsp;<input type=\"text\" placeholder=\"Last name\" class=\"last-name-input\"/></div><div class=\"email-pass-inputs\"><h2>Account</h2><input type=\"email\" placeholder=\"Email\" class=\"email-input\"/>&nbsp;&nbsp;&nbsp;<span class=\"ss-plus\"></span>&nbsp;&nbsp;&nbsp;<input type=\"password\" placeholder=\"Password\" class=\"password-input\"/></div></div><div class=\"terms-of-service\"><input type=\"checkbox\" class=\"terms-checkbox\"/><span class=\"terms-text\">I agree to the Terms &amp; Agreement</span></div><input type=\"button\" id=\"submit-registration-1\" value=\"Continue &gt;&gt;\" class=\"registration-button\"/></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/registration/registrationUploadUserPhotoTemplate"] = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"registration-page-2\"><h1>Upload an awesome picture!</h1><div class=\"user-image-preview\"><img id=\"profilePicturePreview\"/><div class=\"upload-buttons\"><input type=\"file\" id=\"imgUpload\" accept=\"image/*\"/><input type=\"button\" id=\"submit-registration-2\" value=\"Upload\" class=\"search-button button\"/></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/search/masterSearchTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),searchTerm = locals_.searchTerm,searchLocation = locals_.searchLocation;buf.push("<div class=\"row\"><div class=\"col-md-1\"></div><div class=\"col-md-10 search-results-container\"><div class=\"profile-title\">");
if ( searchTerm && searchLocation)
{
buf.push(jade.escape(null == (jade.interp = 'Searched for ' + searchTerm + ' near ' + searchLocation) ? "" : jade.interp));
}
else if ( searchTerm)
{
buf.push(jade.escape(null == (jade.interp = 'Search for ' + searchTerm) ? "" : jade.interp));
}
else if ( searchLocation)
{
buf.push(jade.escape(null == (jade.interp = 'Searched for profiles near ' + searchLocation) ? "" : jade.interp));
}
buf.push("</div></div><div class=\"col-md-1\"></div></div><div class=\"row\"><div class=\"col-md-1\"></div><div class=\"col-md-7 profile-subtitle\"><div id=\"search-result-status\" class=\"num-of-results\"></div></div></div><div class=\"row\"><div class=\"col-md-1\"></div><div class=\"col-md-8 search-results\"></div><div class=\"col-md-2 ad-space-container hidden-xs hidden-sm\"><div class=\"example-ad\"><a href=\"http://www.procomps.com/\" target=\"_blank\"><img src=\"images/ads/ad-progressive-components.png\"/></a></div><div class=\"example-ad\"><a href=\"http://www.ast-tech.de/\" target=\"_blank\"><img src=\"images/ads/ad-ast-technology.png\"/></a></div><div class=\"example-ad\"><a href=\"http://www.jdltech.ca/index.html\" target=\"_blank\"><img src=\"images/ads/ad-perfect-cal-card.png\"/></a></div><div class=\"example-ad\"><a href=\"mailto:contact@across-mold.com\"><img src=\"images/ads/advertise_your_business.jpeg\"/></a></div></div></div>");;return buf.join("");
};

this["JST"]["app/scripts/templates/search/searchResultTemplate"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),profile = locals_.profile,profileId = locals_.profileId;buf.push("<div class=\"row search-result-panel\">");
var profileImgUrl = "images/placeholder_imgs/profile_placeholder.png"
if ( profile.profilePictureUrl)
{
profileImgUrl = profile.profilePictureUrl
}
buf.push("<div class=\"col-xs-7 col-sm-3 col-md-3 col-lg-3\"><div class=\"profile-image-box\"><div" + (jade.attrs({ 'style':("background:url('" + profileImgUrl +"')"), 'data-profileid':(profileId), "class": [('profile-image-container')] }, {"style":true,"data-profileid":true})) + "></div></div></div><div class=\"visible-xs col-xs-5\"><br/><div class=\"profile-title text-right\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "</div><br/></div><div class=\"col-xs-12 col-sm-8 col-md-8 col-lg-8\"><div class=\"content\"><div class=\"profile-title hidden-xs\">" + (jade.escape(null == (jade.interp = profile.profileName) ? "" : jade.interp)) + "&nbsp;<span class=\"orgs\">");
if ( profile.profileType == 'business' || profile.profileType == 'venue')
{
if ( profile.certifications)
{
// iterate profile.certifications
;(function(){
  var $$obj = profile.certifications;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var val = $$obj[index];

buf.push(jade.escape(null == (jade.interp = val) ? "" : jade.interp));
if ( index < profile.certifications.length -1)
{
buf.push(jade.escape(null == (jade.interp = '/') ? "" : jade.interp));
}
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var val = $$obj[index];

buf.push(jade.escape(null == (jade.interp = val) ? "" : jade.interp));
if ( index < profile.certifications.length -1)
{
buf.push(jade.escape(null == (jade.interp = '/') ? "" : jade.interp));
}
    }

  }
}).call(this);

}
}
else
{
if ( profile.organizations)
{
for (var x = 0; x < profile.organizations.length; x++)
{
if ( x == profile.organizations.length - 1)
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x]) ? "" : jade.interp));
}
else
{
buf.push(jade.escape(null == (jade.interp = profile.organizations[x] + "/") ? "" : jade.interp));
}
}
}
}
buf.push("</span></div><div class=\"subtitle\">");
if ( profile.profileType == 'venue')
{
buf.push("<div class=\"heading\">Venue Type:</div>");
}
else if ( profile.profileType == 'business')
{
buf.push("<div class=\"heading\">Services:</div>");
}
else
{
buf.push("<div class=\"heading\">Skills:</div>");
}
if ( profile.skills)
{
for (var x = 0; x < profile.skills.length; x++)
{
if ( x == profile.skills.length - 1)
{
if ( profile.skills[x])
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType) ? "" : jade.interp));
}
}
else
{
if ( profile.skills[x])
{
buf.push(jade.escape(null == (jade.interp = profile.skills[x].skillType + ", ") ? "" : jade.interp));
}
}
}
}
buf.push("</div><div class=\"subtitle\"><div class=\"heading\">Tags:</div>");
if ( profile.tags)
{
for (var x = 0; x < profile.tags.length; x++)
{
if ( x == profile.tags.length - 1)
{
if ( profile.tags[x])
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x]) ? "" : jade.interp));
}
}
else
{
if ( profile.tags[x])
{
buf.push(jade.escape(null == (jade.interp = profile.tags[x] + ", ") ? "" : jade.interp));
}
}
}
}
buf.push("</div><div class=\"profile-location subtitle\"><div class=\"heading\">Location:</div>");
if ( profile.location)
{
buf.push(jade.escape(null == (jade.interp = profile.location) ? "" : jade.interp));
}
buf.push("</div><div class=\"bottom-buttons\"><input" + (jade.attrs({ 'type':("button"), 'value':("View Profile"), 'data-profileid':(profileId), "class": [('viewProfile'),('button-red')] }, {"type":true,"value":true,"data-profileid":true})) + "/></div></div></div></div>");;return buf.join("");
};

return this["JST"];

});