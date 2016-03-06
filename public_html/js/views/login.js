define(function (require) {
        var tmpl = require('tmpl/login');
        var baseView = require('views/baseView');
        var user = require('models/user');
        var View = baseView.extend({
            template: tmpl,
            events: {
                'click #sign-in': function(e) {
                    e.preventDefault();
                    $('.alert-box.error').finish();
                    var login = document.getElementById('login-input').value;
                    var password = document.getElementById('password-input').value;
                    $('#sign-in').prop("disabled", true);
                    user.authorize(login, password);
                }
            },
            initialize: function () {
                this.render();
                this.listenTo(user, "invalidLoginPassword", this.showErrorMessage);
            },
            showErrorMessage: function () {
                $('.alert-box.error').html('Error: Invalid Login or Password').fadeIn(400,function(){
                    $('#sign-in').prop("disabled", false);
                }).fadeOut(2200);

            }
        });

        return new View();
    }
);