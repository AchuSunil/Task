// FOR FORM VALIDATION
$.validator.addMethod("alpha", function (value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});
$.validator.addMethod("isEmail", function (value, element) {
    return this.optional(element) || value == value.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i);
});

$(document).ready(() => {
    // Login
    $("#login").validate({
        rules: {
            email: {
                required: true,
                minlength: 3,
                isEmail: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
            email: {
                required: "*Required Feild",
                minlength: "Min character 3",
                isEmail: "Enter a valid user_email",
            },
            password: {
                required: "*Required Feild",
            },
        },
    }),
        $("#alogin").validate({
            rules: {
                email: {
                    required: true,
                    minlength: 3,
                    isEmail: true,
                },
                password: {
                    required: true,
                },
            },
            messages: {
                email: {
                    required: "*Required Feild",
                    minlength: "Min character 3",
                    isEmail: "Enter a valid user_email",
                },
                password: {
                    required: "*Required Feild",
                },
            },
        });
});

$(document).ready(() => {
    // SignUp
    $("#signup").validate({
        rules: {
            username: {
                required: true,
                minlength: 3,
                alpha: true,
            },
            email: {
                required: true,
                minlength: 3,
                isEmail: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
            username: {
                alpha: "*Characters only",
                required: "*Required Feild",
                minlength: "*Min character 3",
            },
            number: {
                required: "*Required Feild",
                minlength: "*Enter 10 digit mobile number",
            },

            email: {
                required: "*Required Feild",
                minlength: "*Min character 3",
                isEmail: "*Enter a valid user_email",
            },
            password: {
                required: "*Required Feild",
            },
        },
    });
});
