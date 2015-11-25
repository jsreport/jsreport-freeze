define(["app", "marionette", "backbone", "jquery"],
    function (app, Marionette, Backbone, $) {

        app.on("menu-actions-render", function (context) {
            if (app.settings.tenant.isAdmin) {
                if (app.settings.data.freeze && app.settings.data.freeze.value) {
                    context.result += "<li><a id='releaseFreezeCommand' class='validate-leaving'>Release freeze</a></li>";
                    context.on("after-render", function ($el) {
                        $($el).find("#releaseFreezeCommand").click(function () {
                            app.settings.saveOrUpdate("freeze", false, function() {
                                window.location.reload();
                            });
                        });
                    });
                } else {
                    context.result += "<li><a id='freezeCommand' class='validate-leaving'>Freeze editing</a></li>";
                    context.on("after-render", function ($el) {
                        $($el).find("#freezeCommand").click(function () {
                            app.settings.saveOrUpdate("freeze", true, function() {
                                window.location.reload();
                            });
                        });
                    });
                }
            }
        });
    });
