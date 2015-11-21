(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['site_config', 'backbone-support', 'parse', 'modal', 'helpers', 'mandrill'], function(Mi, Support, Parse) {
    return Mi.Routers.MessagesRouter = (function() {
      function MessagesRouter() {
        this.removeWaiting = __bind(this.removeWaiting, this);
        this.showWaiting = __bind(this.showWaiting, this);
        this.showMessage = __bind(this.showMessage, this);
        this.renderMandrillTemplate = __bind(this.renderMandrillTemplate, this);
        this.sendEmail = __bind(this.sendEmail, this);
        this.sendSignupEmail = __bind(this.sendSignupEmail, this);
      }

      MessagesRouter.prototype.messageTemplate = JST['app/scripts/templates/modals/message-modal'];

      MessagesRouter.prototype.waitTemplate = JST['app/scripts/templates/modals/wait-modal'];

      MessagesRouter.prototype.sendSignupEmail = function(toName, toAddress) {
        var messageData, ptype, qry,
          _this = this;
        messageData = {
          to: [
            {
              email: toAddress,
              name: toName,
              type: "to"
            }, {
              email: "signup@across-mold.com",
              name: "Sign up notification",
              type: "bcc"
            }
          ],
          headers: null,
          from_email: "signup@across-mold.com",
          important: false,
          track_opens: null,
          track_clicks: null,
          auto_text: null,
          auto_html: null,
          inline_css: null,
          url_strip_qs: null,
          preserve_recipients: null,
          view_content_link: null,
          bcc_address: "john@fleisherdev.com",
          tracking_domain: null,
          signing_domain: null,
          return_path_domain: null,
          merge: false,
          global_merge_vars: [],
          merge_vars: [],
          tags: ["makeitglobal_sign_up"],
          subaccount: null,
          google_analytics_domains: ["across-mold.com"],
          google_analytics_campaign: "signup@across-mold.com",
          metadata: null,
          recipient_metadata: []
        };
        ptype = Parse.Object.extend('Email_templates');
        qry = new Parse.Query(ptype);
        qry.equalTo('name', 'signup');
        return qry.find({
          success: function(results) {
            var emailTemplate, mc;
            console.log("found custom profile tags data, results: ", results);
            if (results && results[0]) {
              emailTemplate = results[0].get('mandrill_tag');
              mc = new mandrill.Mandrill('vmFpWVhz1LJZp3mI_dQUZA');
              return mc.messages.sendTemplate({
                async: false,
                template_name: emailTemplate,
                template_content: {},
                message: messageData
              }, function(result) {
                return console.log(result);
              }, function(error) {
                return console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message);
              });
            }
          }
        });
      };

      MessagesRouter.prototype.sendEmail = function(toName, toAddress, fromName, fromAddress, subject, messageHtml, messageText, email_tag, attachments, callback) {
        var mc, message;
        if (!email_tag) {
          email_tag = 'AcrossMold-email';
        }
        if (!fromAddress) {
          fromAddress = 'support@across-mold.com';
        }
        if (!fromName) {
          fromName = 'across-mold.com';
        }
        if (!attachments) {
          attachments = [];
        }
        message = {
          html: messageHtml,
          text: messageText,
          subject: subject,
          from_email: fromAddress,
          from_name: fromName,
          to: [
            {
              email: toAddress,
              name: toName,
              type: "to"
            }
          ],
          headers: null,
          important: false,
          track_opens: null,
          track_clicks: null,
          auto_text: null,
          auto_html: null,
          inline_css: null,
          url_strip_qs: null,
          preserve_recipients: null,
          view_content_link: null,
          bcc_address: "john@fleisherdev.com",
          tracking_domain: null,
          signing_domain: null,
          return_path_domain: null,
          merge: false,
          global_merge_vars: [],
          merge_vars: [],
          tags: [email_tag],
          subaccount: null,
          google_analytics_domains: ["across-mold.com"],
          google_analytics_campaign: "message.support@across-mold.com",
          metadata: {
            website: "www.across-mold.com"
          },
          recipient_metadata: [],
          attachments: attachments,
          images: []
        };
        mc = new mandrill.Mandrill('VKdzPNeCFNuJzEZJOlxlbQ');
        return mc.messages.send({
          "message": message,
          "async": false,
          "ip_pool": "Main Pool"
        }, function(result) {
          console.log(result);
          if (callback) {
            return callback(result);
          }
        }, function(error) {
          console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message);
          if (callback) {
            return callback(error);
          }
        });
      };

      MessagesRouter.prototype.renderMandrillTemplate = function(name, content) {
        var merge_vars, template_content, template_name;
        template_name = "makeitglobal_simple";
        template_content = [
          {
            name: name,
            content: content
          }
        ];
        merge_vars = [
          {
            name: "merge1",
            content: "merge1 content"
          }
        ];
        return this.MandrillClient.templates.render({
          template_name: template_name,
          template_content: template_content,
          merge_vars: merge_vars
        }, function(result) {
          return console.log(result);
        }, function(e) {
          return console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
      };

      MessagesRouter.prototype.showMessage = function(message, after) {
        var msgDlg;
        $('#site-message-modal').remove();
        msgDlg = this.messageTemplate({
          messageText: message
        });
        $('body').append(msgDlg);
        $(document).delegate('input.close-message', 'click', function() {
          $('#site-message-modal').modal('hide');
          $('#site-message-modal').remove();
          if (after) {
            return after();
          }
        });
        $('#site-message-modal').modal('show');
        return this;
      };

      MessagesRouter.prototype.showWaiting = function(message, after) {
        var msgDlg;
        $('#site-message-modal').remove();
        msgDlg = this.waitTemplate({
          messageText: message
        });
        $('body').append(msgDlg);
        $('#site-message-modal').modal('show');
        return this;
      };

      MessagesRouter.prototype.removeWaiting = function() {
        $('#site-message-modal').modal('hide');
        return $('#site-message-modal').remove();
      };

      return MessagesRouter;

    })();
  });

}).call(this);
