(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'modal', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    return Mi.Views.EditQuotationView = (function(_super) {
      __extends(EditQuotationView, _super);

      function EditQuotationView() {
        this.readAsBinaryString = __bind(this.readAsBinaryString, this);
        _ref = EditQuotationView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      EditQuotationView.prototype.quotationTemplate = JST['app/scripts/templates/quotation/quotationTemplate'];

      EditQuotationView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      EditQuotationView.prototype.className = 'edit-quotation wrapper';

      EditQuotationView.prototype.events = {
        'click #upload-quotation-file': 'uploadFile',
        'click #send-quotation-request': 'sendRequest',
        'click .open-modal': 'showModal',
        'click .close-modal': 'closeModal',
        'click #quote-submit': 'submitQuote',
        'click #quote-cancel': 'closeQuote',
        'click #quotation_file_btn': 'clickFileButton',
        'change input#quotation_file': 'addDocument',
        'click .quote-file-remove': 'removeDocument'
      };

      EditQuotationView.prototype.initialize = function() {
        var checkDom, domLoop, footer;
        console.log('EditQuotationView initialized');
        checkDom = function() {
          return $("#quote-attachments").length;
        };
        footer = this.footerTemplate;
        return domLoop = setInterval(function() {
          console.log('running!');
          if (checkDom()) {
            clearInterval(domLoop);
            $('.footer-container').remove();
            return $('#footer').html(footer());
          }
        }, 1000);
      };

      EditQuotationView.prototype.render = function() {
        this.$el.append(this.quotationTemplate());
        $('#footer').html(this.footerTemplate);
        return this;
      };

      EditQuotationView.prototype.clickFileButton = function(event) {
        return $('#quotation_file').click();
      };

      EditQuotationView.prototype.addDocument = function(event) {
        var el, file, fileLabel, files, line_item, size;
        el = document.getElementById('quotation_file');
        files = el.files;
        if (files.length === 0) {
          return;
        }
        file = files[0];
        line_item = $('<span/>').addClass('attached-file').data('file', file);
        size = Math.ceil(file.size / 1024);
        if (size > 1024) {
          fileLabel = file.name + ' (' + Math.ceil(size / 1024) + 'Mb)';
          if (size > 25 * 1024) {
            window.Mi.messagesRouter.showMessage("File too large:\n" + fileLabel + '\n\nPlease consider adding as .zip');
            return;
          } else {
            $(line_item).html(fileLabel + '<span class="quote-file-remove">remove</span><br>');
          }
        } else {
          $(line_item).html(file.name + ' (' + size + 'kb)&nbsp;<span class="quote-file-remove">remove</span><br>');
        }
        if ($('#quote-attachments').children().count % 2 === 0) {
          $(line_item).addClass('even');
        }
        $(line_item).insertBefore($('#quotation_file_btn'));
        $('#quotation-add-document-modal').hide();
        return $(el).val(void 0);
      };

      EditQuotationView.prototype.removeDocument = function(event) {
        return $(event.currentTarget).parent('.attached-file').remove();
      };

      EditQuotationView.prototype.closeQuote = function(event) {
        if (window.history.length === 0) {
          return window.Mi.appRouter.navigate('#/microsite');
        } else {
          return window.history.back();
        }
      };

      EditQuotationView.prototype.closeModal = function(event) {
        var modalname;
        console.log('closModal called, Target:', event.currentTarget);
        modalname = $(event.currentTarget).data('closemodal');
        return $('#' + modalname).hide();
      };

      EditQuotationView.prototype.showModal = function(event) {
        var targetModal;
        console.log('showModal called, Target:', event.currentTarget);
        targetModal = $(event.currentTarget).data("openmodal");
        $(".popover").hide();
        $('.modal').modal('hide');
        return $("#" + targetModal).show();
      };

      EditQuotationView.prototype.isValidEmail = function(email) {
        var regex;
        regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
      };

      EditQuotationView.prototype.submitQuote = function(event) {
        var errors, fromAddress, fromName, jobDescription, requiredMsg,
          _this = this;
        fromName = $('#quote_contact_name').val();
        fromAddress = $('#quote_email').val();
        jobDescription = $('textarea#quote_job_details').val();
        errors = [];
        if (!fromName) {
          errors.push('Your Name cannot be blank.');
        }
        if (!fromAddress) {
          errors.push('Your email address cannot be blank.');
        } else {
          if (!this.isValidEmail(fromAddress)) {
            errors.push('Invalid email: ' + fromAddress);
          }
        }
        if (!jobDescription) {
          errors.push('Job Description cannot be blank.');
        }
        if (errors.length > 0) {
          requiredMsg = "Please enter required information:";
          $(errors).each(function(index, err) {
            return requiredMsg += '\n   ' + err;
          });
          return window.Mi.messagesRouter.showMessage(requiredMsg, void 0);
        } else {
          return this.sendQuotationRequestMessage(fromName, fromAddress, jobDescription);
        }
      };

      EditQuotationView.prototype.sendQuotationRequestMessage = function(fromName, fromAddress, jobDescription) {
        var attachedFiles, attachments, doSend, email_tag, fileCount, handleResult, messageHtml, msg, subject, toAddress, toName,
          _this = this;
        toName = 'AcrossMold';
        toAddress = 'RFQ@across-mold.com';
        subject = 'AcrossMold: Quotation Requested';
        messageHtml = '<html>No html content</html>';
        email_tag = 'AcrossMold-quotation-request';
        msg = "A quotation request has been received\n";
        msg = "*** Quotation Request ***\n";
        msg += "\n\nName: " + fromName;
        msg += "\n\nEmail: " + fromAddress;
        msg += "\n\nCompany: " + $('#quote_company_name').val();
        msg += "\n\nJob Title: " + $('#quote_job_name').val();
        msg += "\n\nJob Description:\n";
        msg += jobDescription;
        msg += "\n\n\n *** End of Quotation Request ***\n\n\n";
        attachments = [];
        attachedFiles = [];
        $('#quote-attachments .attached-file').each(function(index, elFile) {
          return attachedFiles.push($(elFile).data('file'));
        });
        handleResult = function(data) {
          window.Mi.messagesRouter.removeWaiting();
          if (data[0].status === 'error') {
            return window.Mi.messagesRouter.showMessage('Error sending quotation request:\n\n' + data.error, void 0);
          } else {
            return window.Mi.messagesRouter.showMessage('Your quote request has been sent.\n\nThank you for your using AcrossMold.', _this.closeQuote);
          }
        };
        doSend = function() {
          window.Mi.messagesRouter.showWaiting("Please wait. Sending request...");
          return window.Mi.messagesRouter.sendEmail(toName, toAddress, fromName, fromAddress, subject, null, msg, email_tag, attachments, handleResult);
        };
        if (attachedFiles.length === 0) {
          return doSend();
        } else {
          fileCount = attachedFiles.length;
          return $(attachedFiles).each(function(index, file) {
            var filename, filetype, reader;
            reader = new FileReader();
            filetype = file.type;
            filename = file.name;
            reader.onload = function(event) {
              var attachFile;
              attachFile = {
                type: filetype,
                name: filename,
                content: btoa(event.target.result)
              };
              attachments.push(attachFile);
              if (attachments.length === fileCount) {
                return doSend();
              }
            };
            return reader.readAsBinaryString(file);
          });
        }
      };

      EditQuotationView.prototype.readAsBinaryString = function(file) {
        var fileName, fileType;
        fileType = file.type;
        return fileName = file.name;
      };

      return EditQuotationView;

    })(Support.CompositeView);
  });

}).call(this);
