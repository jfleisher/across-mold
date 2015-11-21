define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'modal'
  'templates'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.EditQuotationView extends Support.CompositeView
    quotationTemplate:             JST['app/scripts/templates/quotation/quotationTemplate'],
    footerTemplate:                JST['app/scripts/templates/footer']
 
    className: 'edit-quotation wrapper'

    events:
      'click #upload-quotation-file'    :   'uploadFile'
      'click #send-quotation-request'   :   'sendRequest'
      'click .open-modal'               :   'showModal'
      'click .close-modal'              :   'closeModal'
      'click #quote-submit'             :   'submitQuote'
      'click #quote-cancel'             :   'closeQuote'
      'click #quotation_file_btn'       :   'clickFileButton'
      'change input#quotation_file'     :   'addDocument'
      'click .quote-file-remove'        :   'removeDocument'

    initialize: ->
      console.log 'EditQuotationView initialized'
      checkDom = ->
        return $("#quote-attachments").length

      footer = @footerTemplate
      domLoop = setInterval ->
        console.log('running!')
        if checkDom()
          clearInterval(domLoop)
          $('.footer-container').remove()
          $('#footer').html footer()
      , 1000

    render: ->
      @$el.append @quotationTemplate()
      $('#footer').html @footerTemplate
      @

    clickFileButton: (event) ->
      $('#quotation_file').click()

    addDocument: (event)->
      el = document.getElementById('quotation_file')
      files = el.files
      if files.length == 0
        return

      file = files[0]
      line_item = $('<span/>').addClass('attached-file').data('file',file)
      size = Math.ceil(file.size / 1024)
      if(size > 1024)
        fileLabel = file.name + ' (' + Math.ceil(size/1024) + 'Mb)'
        if size > 25 * 1024
          window.Mi.messagesRouter.showMessage "File too large:\n" + fileLabel + '\n\nPlease consider adding as .zip'
          return
        else
          $(line_item).html(fileLabel + '<span class="quote-file-remove">remove</span><br>')
      else
        $(line_item).html(file.name + ' (' + size + 'kb)&nbsp;<span class="quote-file-remove">remove</span><br>')
      if $('#quote-attachments').children().count % 2 == 0
        $(line_item).addClass('even')
      $(line_item).insertBefore($('#quotation_file_btn'))
      $('#quotation-add-document-modal').hide()
      $(el).val(undefined)

    removeDocument: (event) ->
      $(event.currentTarget).parent('.attached-file').remove()

    closeQuote: (event) ->
      if window.history.length == 0
        window.Mi.appRouter.navigate('#/microsite')
      else
        window.history.back()

    closeModal: (event)->
      console.log 'closModal called, Target:', event.currentTarget
      modalname = $(event.currentTarget).data('closemodal')
      $('#'+modalname).hide()

    showModal: (event) ->
      console.log 'showModal called, Target:', event.currentTarget
      targetModal = $(event.currentTarget).data("openmodal")
      $(".popover").hide()
      $('.modal').modal('hide')
      $("##{targetModal}").show()

    isValidEmail: (email) ->
      regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
      return regex.test(email);

    submitQuote: (event) ->
      fromName       = $('#quote_contact_name').val()
      fromAddress    = $('#quote_email').val()
      jobDescription = $('textarea#quote_job_details').val()

      errors = []
      if !fromName
        errors.push 'Your Name cannot be blank.'

      if !fromAddress
        errors.push 'Your email address cannot be blank.'
      else 
        if !@isValidEmail(fromAddress)
          errors.push 'Invalid email: ' + fromAddress

      if !jobDescription
        errors.push 'Job Description cannot be blank.'

      if errors.length > 0
        requiredMsg = "Please enter required information:"
        $(errors).each (index, err) =>
          requiredMsg += '\n   ' + err
        window.Mi.messagesRouter.showMessage requiredMsg, undefined
      else
        @sendQuotationRequestMessage fromName, fromAddress, jobDescription

    sendQuotationRequestMessage:  (fromName, fromAddress, jobDescription) ->
      toName        = 'AcrossMold'
      toAddress     = 'RFQ@across-mold.com'
      subject       = 'AcrossMold: Quotation Requested'
      messageHtml   = '<html>No html content</html>'
      email_tag     = 'AcrossMold-quotation-request'

      msg = "A quotation request has been received\n";
      msg = "*** Quotation Request ***\n"
      msg += "\n\nName: " + fromName
      msg += "\n\nEmail: " + fromAddress
      msg += "\n\nCompany: " + $('#quote_company_name').val()
      msg += "\n\nJob Title: " + $('#quote_job_name').val()
      msg += "\n\nJob Description:\n"
      msg += jobDescription
      msg += "\n\n\n *** End of Quotation Request ***\n\n\n"

      attachments = []
      attachedFiles = []
      $('#quote-attachments .attached-file').each (index, elFile) =>
        attachedFiles.push($(elFile).data('file'))

      handleResult = (data) =>
        window.Mi.messagesRouter.removeWaiting()
        if data[0].status == 'error'
          window.Mi.messagesRouter.showMessage 'Error sending quotation request:\n\n'+data.error, undefined
        else
          window.Mi.messagesRouter.showMessage 'Your quote request has been sent.\n\nThank you for your using AcrossMold.', @closeQuote

      doSend = () =>
        window.Mi.messagesRouter.showWaiting "Please wait. Sending request..."
        window.Mi.messagesRouter.sendEmail toName, toAddress, fromName, fromAddress, subject, null, msg, email_tag, attachments, handleResult

      if attachedFiles.length == 0
        doSend()
      else
          fileCount = attachedFiles.length
          $(attachedFiles).each (index, file) => 
            reader = new FileReader();
            filetype = file.type
            filename = file.name
            reader.onload = (event) ->
              attachFile =
                type: filetype
                name: filename
                content: btoa(event.target.result)
              attachments.push attachFile
              if attachments.length == fileCount
                doSend()

            reader.readAsBinaryString(file)


    readAsBinaryString: (file) =>
      fileType = file.type
      fileName = file.name
