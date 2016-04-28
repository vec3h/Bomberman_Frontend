define(function (require) {
        var tmpl = require('tmpl/register');
        var baseView = require('views/baseView');
        var app = require('app');
        var View = baseView.extend({
            template: tmpl,
            events: {
                'click #sign-up': function(e) {
                    e.preventDefault();
                    this.$('.alert-box.error').finish();
                    var login = document.getElementById('reg-login-input').value;
                    var password = document.getElementById('reg-password-input').value;
                    this.$('#sign-in').prop("disabled", true);
                    app.user.registerNew(login, password);
                }
            },
            initialize: function () {
                this.render();
                this.listenTo(app.user, "invalidForm", this.showErrorMessage);
                this.listenTo(app.user, 'userRegistered', this.reloadAll);
            },
            reloadAll: function() {
                this.$('#sign-in').prop("disabled", false);
                document.getElementById('reg-login-input').value = "";
                document.getElementById('reg-password-input').value = "";
                window.location.href = '#main'
            },
            showErrorMessage: function (msg) {
                this.$('.alert-box.error').html('Error: ' + msg).fadeIn(400,function(){
                    $('#sign-in').prop("disabled", false)}).fadeOut(2200);
            }

        });

        return new View();
    }
);