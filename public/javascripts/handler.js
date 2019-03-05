$(document).ready(function() {

    $("#login").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var logData = {};
        $.each(form.serializeArray(), function(){
            logData[this.name] = this.value;
        });
        var logJSON = JSON.stringify(logData);

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/login",
            data: logJSON,
            dataType: "json",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {

                    window.location.href="/ttt";
                }
                else if (status.status === "ERROR")
                {
                    alert("Login failed.");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });


    });

    $("#registration").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var regData = {};
        $.each(form.serializeArray(), function(){
            regData[this.name] = this.value;
        });
        var regJSON = JSON.stringify(regData);

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/adduser",
            data: regJSON,
            dataType: "json",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {
                    window.location.href="/verify";
                }
                else if (status.status === "ERROR")
                {
                    alert("Registration failed. Is this a unique e-mail?");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });


    });

    $("#logoutBtn").click(function (e) {
        $.ajax({
            type: "POST",
            url: "/logout",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {
                    window.location.href="/ttt";
                }
                else if (status.status === "ERROR")
                {
                    alert("Logout failed? Uhhh...");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });
    });

    $("#listGamesBtn").click(function (e) {
        $.ajax({
            type: "POST",
            url: "/listgames",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {
                    console.log(status.games);
                }
                else if (status.status === "ERROR")
                {
                    alert("List games failed");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });
    });


    $("#getScoreBtn").click(function (e) {
        $.ajax({
            type: "POST",
            url: "/getscore",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {
                    console.log(status);
                }
                else if (status.status === "ERROR")
                {
                    alert("get score failed");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });
    });

    $("#getGameBtn").click(function (e) {

        var gameId = {id: "kobe2"};
        var idJSON = JSON.stringify(gameId);
        $.ajax({
            type: "POST",
            url: "/getgame",
            contentType: "application/json",
            data: idJSON,
            dataType: "json",
            cache: false,
            success: function (status) {
                if (status.status === "OK") {
                    console.log(status);
                }
                else if (status.status === "ERROR")
                {
                    alert("get game failed");
                }
            },
            error: function (e) {
                console.log("Failure: ", e);
            }
        });
    });


        /*
        $(function () {
            // Initialize form validation on the registration form.
            // It has the name attribute "registration"
            $("#registration").validate({
                // Specify validation rules
                rules: {
                    // The key name on the left side is the name attribute
                    // of an input field. Validation rules are defined
                    // on the right side
                    username: "required",
                    password: "required",
                    email: {
                        required: true,
                        // Specify that email should be validated
                        // by the built-in "email" rule
                        email: true
                    }
                },
                // Specify validation error messages
                messages: {
                    username: "Please enter a username",
                    password: "Please enter a password",
                    email: "Please enter a valid email address"
                },
                // Make sure the form is submitted to the destination defined
                // in the "action" attribute of the form when valid
                submitHandler: function (form) {
                    form.submit();
                }
            });

        });
        */
});