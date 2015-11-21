define [
  'site_config'
  'backbone-support'
  'parse'
  'modal'
  'helpers'
  'mandrill'

], (Mi, Support, Parse) ->
  class Mi.Routers.MessagesRouter

    messageTemplate: JST['app/scripts/templates/modals/message-modal']
    waitTemplate: JST['app/scripts/templates/modals/wait-modal']

    sendSignupEmail: (toName, toAddress) =>

      messageData =
        to: [
          {email: toAddress
          name: toName
          type: "to"},
          {email: "signup@across-mold.com"
          name: "Sign up notification"
          type: "bcc"}
          ]
        headers: null
        from_email: "signup@across-mold.com"
        important: false
        track_opens: null
        track_clicks: null
        auto_text: null
        auto_html: null
        inline_css: null
        url_strip_qs: null
        preserve_recipients: null
        view_content_link: null
        bcc_address: "john@fleisherdev.com"
        tracking_domain: null
        signing_domain: null
        return_path_domain: null
        merge: false
        global_merge_vars: []
        merge_vars: []
        tags: ["makeitglobal_sign_up"]
        subaccount: null
        google_analytics_domains: ["across-mold.com"]
        google_analytics_campaign: "signup@across-mold.com"
        metadata: null
        recipient_metadata: []

      ptype = Parse.Object.extend('Email_templates')
      qry = new Parse.Query(ptype)
      qry.equalTo('name', 'signup')
      qry.find
       success: (results) =>
         console.log "found custom profile tags data, results: ", results
         if results && results[0]
           emailTemplate = results[0].get('mandrill_tag')
           mc = new mandrill.Mandrill('vmFpWVhz1LJZp3mI_dQUZA')
           mc.messages.sendTemplate
              async: false
              template_name: emailTemplate
              template_content: {}
              message: messageData
              , (result) ->
                console.log(result)
              , (error) ->
                console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message)




    sendEmail: (toName, toAddress, fromName, fromAddress, subject, messageHtml, messageText, email_tag, attachments, callback) =>
      if !email_tag
        email_tag = 'AcrossMold-email'

      if !fromAddress
        fromAddress = 'support@across-mold.com'

      if !fromName
        fromName = 'across-mold.com'

      if !attachments
        attachments = []

      message =
        html: messageHtml
        text: messageText
        subject: subject
        from_email: fromAddress
        from_name: fromName
        to: [
          email: toAddress
          name: toName
          type: "to"
        ]
        headers: null
        important: false
        track_opens: null
        track_clicks: null
        auto_text: null
        auto_html: null
        inline_css: null
        url_strip_qs: null
        preserve_recipients: null
        view_content_link: null
        bcc_address: "john@fleisherdev.com"
        tracking_domain: null
        signing_domain: null
        return_path_domain: null
        merge: false
        global_merge_vars: []
        merge_vars: []
        tags: [ email_tag ]
        subaccount: null
        google_analytics_domains: ["across-mold.com"]
        google_analytics_campaign: "message.support@across-mold.com"
        metadata:
          website: "www.across-mold.com"
        recipient_metadata: []
        attachments: attachments
        images: []

      mc = new mandrill.Mandrill('VKdzPNeCFNuJzEZJOlxlbQ')
      mc.messages.send
        "message": message
        "async": false
        "ip_pool": "Main Pool"
        , (result) ->
          console.log(result)
          if callback
            callback result
        , (error) ->
          console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message)
          if callback
            callback error



    renderMandrillTemplate: (name, content) =>
      template_name = "makeitglobal_simple"
      template_content = [{
        name: name,
        content: content
        }];
      merge_vars = [{
        name: "merge1",
        content: "merge1 content"
        }];

      @MandrillClient.templates.render
        template_name: template_name
        template_content: template_content
        merge_vars: merge_vars
        ,(result) ->
          console.log(result)
        ,(e) ->
          console.log 'A mandrill error occurred: ' + e.name + ' - ' + e.message


  
    showMessage: (message, after) =>
      $('#site-message-modal').remove()
      msgDlg = @messageTemplate
        messageText: message
      $('body').append(msgDlg)
      $(document).delegate 'input.close-message', 'click', () ->
        $('#site-message-modal').modal('hide')
        $('#site-message-modal').remove()
        if after
          after()
      $('#site-message-modal').modal('show')
      @

    showWaiting: (message, after) =>
      $('#site-message-modal').remove()
      msgDlg = @waitTemplate
        messageText: message
      $('body').append(msgDlg)
      $('#site-message-modal').modal('show')
      @

    removeWaiting: () =>
      $('#site-message-modal').modal('hide')
      $('#site-message-modal').remove()
