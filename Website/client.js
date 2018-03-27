
window.onload = function () {

    $("#startTimeModeInput").timepicker({ timeFormat: 'HH:mm' });
    $("#endTimeModeInput").timepicker({ timeFormat: 'HH:mm' });

    getPatterns();
    getStatus();

    var interval = 1; //interval synchronisation in minutes;
    var delay = (interval * 60) * 1000;
    
    let timerId = setTimeout(function tick() {
        getStatus();
        timerId = setTimeout(tick, delay);
    }, delay);
    
};

$(function () {

    $("#colorPickerButton").click(function () {
        
        var color = $("#full").val();

        var data = JSON.stringify({
            "color": color
        });

        $.ajax({
            method: "POST",
            url: "/color",
            contentType: "application/json",
            data: data
        })
        .done(function () {
            showSuccess("#colorError", "The color was successfully saved");
            $("#color").text(color);
        })
        .fail(function (msg) {
            showError("#colorError", "The color was not saved. Please try again.");
        });
    });

    $("#patternForm").submit(function (event) {
        event.preventDefault();

        var pattern = $("#patternDropdown").val();
        
        var data = JSON.stringify({
            "pattern": pattern 
        });

        $.ajax({
            method: "POST",
            url: "/pattern",
            contentType: "application/json",
            data: data
        })
        .done(function () {
            showSuccess("#patternError", "The pattern was successfully saved");
            $("#pattern").text($("#patternDropdown option[value=" + pattern + "]").text());
        })
        .fail(function (msg) {
            showError("#patternError", "Something went wrong, please try again.");
        });
    });

    $("#brightnessForm").submit(function (event) {
        event.preventDefault();

        var brightness = $("#brightnessForm").find('input[name="brightnessInput"]').val();

        if (!$.isNumeric(brightness))
            showError("#brightnessError", "The given value was not a number. Please give a number between 0 and 100.");
        else if (brightness > 100)
            showError("#brightnessError", "The brightness cannot be higher than 100.");
        else if (brightness < 0)
            showError("#brightnessError", "The brightness cannot be lower than 0.");
        else {
            var data = JSON.stringify({
                "brightness": brightness
            });

            $.ajax({
                method: "POST",
                url: "/brightness",
                contentType: "application/json",
                data: data
            })
            .done(function () {
                showSuccess("#brightnessError", "The brightness was successfully saved");
                $("#brightnessForm").find('input[name="brightnessInput"]').val("");
                $("#brightness").text(brightness);
            })
            .fail(function (msg) {
                showError("#brightnessError", "Something went wrong, please try again.");
            });
        }
    });

    $("#brightnessModeForm").submit(function (event) {
        event.preventDefault();

        var brightness = $("#brightnessModeForm").find('input[name="brightnessModeInput"]').val();

        if(!$.isNumeric(brightness))
            showError("#brightnessModeError", "The given value was not a number. Please give a number between 0 and 100.");
        else if (brightness > 100)
            showError("#brightnessModeError", "The brightness cannot be higher than 100.");
        else if (brightness < 0)
            showError("#brightnessModeError", "The brightness cannot be lower than 0.");
        else {
            var data = JSON.stringify({
                "mode_brightness": brightness
            });

            $.ajax({
                method: "POST",
                url: "/brightness/mode",
                contentType: "application/json",
                data: data
            })
            .done(function () {
                showSuccess("#brightnessModeError", "The brightness was successfully saved");
                $("#brightnessModeForm").find('input[name="brightnessModeInput"]').val("");
                $("#saving_brightness").text(brightness);
            })
            .fail(function (msg) {
                showError("#brightnessModeError", "Something went wrong, please try again.");
            });
        }
    });

    $("#modeTimeButton").click(function () {

        var startTime = $("#startTimeModeInput").val();
        var endTime = $("#endTimeModeInput").val();

        if(startTime == "" || endTime == "")
        {
            showError("#timeModeError", "Please fill in both time fields before saving.");
        }
        else
        {
            var data = JSON.stringify({
                "mode_start_time": startTime,
                "mode_end_time": endTime
            });

            $.ajax({
                method: "POST",
                url: "/mode/time",
                contentType: "application/json",
                data: data
            })
            .done(function () {
                showSuccess("#timeModeError", "The time was successfully saved");
                $("#start_time").text(startTime);
                $("#end_time").text(endTime);
            })
            .fail(function (msg) {
                showError("#timeModeError", "An error occurred. Please try again.");
            });
        }
    });
});

/*
*-------------------------------------------------------------------------------------------
*Supporting functions
*
*/

//Elementname must be given with their .class or #id.
function showError(elementName, message)
{
    $(elementName).show();
    $(elementName).css("color", "red");
    $(elementName).text(message);

    //turn the display to none after 10 seconds.
    setTimeout(function () {
        $(elementName).hide();
    }, 10000);
}

//Elementname must be given with their .class or #id.
function showSuccess(elementName, message)
{
    $(elementName).show();
    $(elementName).css("color", "green");
    $(elementName).text(message);

    //turn the display to none after 10 seconds.
    setTimeout(function () {
        $(elementName).hide();
    }, 10000);
}

function getStatus()
{
    var result;
    $.getJSON("/status", function (r) {
        result = r;
    })
    .done(function () {

        $("#color").text(result.color);
        $("#pattern").text(result.pattern);
        $("#brightness").text(result.brightness);
        $("#saving_brightness").text(result.mode_brightness);
        $("#start_time").text(result.mode_start_time);
        $("#end_time").text(result.mode_end_time);
    })
    .fail(function () {
        showError("#statusError", "An errror occurred retrieving the status. Please reload the page if this error keeps occurring.");
    });
}

function getPatterns()
{
    var result;
    $.getJSON("/patterns", function (r) {
        result = r;
    })
    .done(function () {

        var $dropdown = $("#patternDropdown");

        $.each(result.patterns, function (index, value) {
            $dropdown.append($("<option />").val(value.name).text(value.display_name));
        });
    })
    .fail(function () {
        showError("#patternError", "An errror occurred retrieving the patterns. Please reload the page.");
    });
}