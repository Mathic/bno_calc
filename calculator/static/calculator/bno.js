// Variables
var gross = [];
var num_trains = 0;
var num_selected = 0;
var level = $('.tech_level').find('.active').text();

// Initialize texts
$('#current_tech_level').text(level);
$('#num_trains').text(num_trains);

SetLevel(level);
CountStops();

// Calculations based on tech level
$('.tech_level').delegate('label', 'change', function() {
    $(this).addClass('active').siblings().removeClass('active');
    level = $('.tech_level').find('.active').text();
    $('#current_tech_level').text(level);

    var maintenance = num_trains * parseInt(level) * 10;
    $('#maintenance').text(maintenance.toString());

    SetLevel(level);
    ResetGross();
    GetGrossIncome(gross, parseInt($('#num_stops').text()));
});

// Add trains, set maintenance cost
$('#train-count').on('click', function() {
    if (num_trains > 5) {
        return false;
    };
    num_trains = num_trains + 1;
    var HTML = html;
    $('#t-tech').append(HTML);

    $('.train-tech').delegate('label', 'click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        CountStops();
        GetGrossIncome(gross, parseInt($('#num_stops').text()));
    });

    var maintenance = num_trains * parseInt(level) * 10;

    $('#num_trains').text(num_trains);
    $('#maintenance').text(maintenance.toString());
    SetLevel(level);
    CountStops();
    GetGrossIncome(gross, parseInt($('#num_stops').text()));
});

// Remove trains set maintenance cost
$(document).on('click', '.remove-train', function() {
    $(this).parent().remove();
    num_trains = num_trains - 1;
    var maintenance = num_trains * parseInt(level) * 10;

    $('#num_trains').text(num_trains);
    $('#maintenance').text(maintenance.toString());
    CountStops();
    GetGrossIncome(gross, parseInt($('#num_stops').text()));
});

// Add income cost of each city to array
$('.city-name').on('change', function() {
    var tech_level = 'tech_' + $('#current_tech_level').text().trim();
    var name = '.' + tech_level + '.' + ($(this)[0].value).replace(' ', '.');
    var num = parseInt($(name).text());
    if (this.checked) {
        gross.push(num);
        $(this).addClass('checked');
        num_selected++;
    } else {
        gross.splice($.inArray(num, gross), 1);
        $(this).removeClass('checked');
        num_selected--;
    }
    $('#cities_selected').text(num_selected.toString());
    GetGrossIncome(gross, parseInt($('#num_stops').text()));
});

// Reset gross incomes
function ResetGross(){
    gross = [];
    var tech_level, name, num;
    $('.city-name.checked').each(function() {
        tech_level = 'tech_' + $('#current_tech_level').text().trim();
        name = '.' + tech_level + '.' + ($(this).attr('value')).replace(' ', '.');
        num = parseInt($(name).text());
        gross.push(num);
    });
};

// Number of stops based on cities checked
function CountStops() {
    var total = 0;
    var add = $('.train-tech').find('.active').text().split('');
    $.each(add, function(index, value) {
        if (!jQuery.isNumeric(parseInt(value))) {
            return true;
        }
        total = total + parseInt(value);
    });
    $('#num_stops').text(total);
};

// Add or remove train tech levels based on overall tech level
function SetLevel(lvl) {
    $('.train-tech').each(function(index) {
        $(this).find('label').each(function() {
            if (parseInt($(this).text()) > parseInt(lvl)) {
                $(this).addClass('invisible');
            } else if ($(this).hasClass('invisible')) {
                $(this).removeClass('invisible');
            }
        });
    });
};

// Get all city income combinations based on train tech level (https://gist.github.com/axelpale/3118596)
function GetGrossIncome(set, k){
    var i, j, combs, head, tailcombs;

    if (k <= 0 || set.length <= 0) {
        $('#gross').text('0');
        return [];
    }

    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
        combs = set;
        $('#gross').text(combs.toString());
        return combs;
    }

    // K-sized set has only one K-sized subset.
    if (k > set.length || k == set.length) {
        if (set.length > 0){
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            $('#gross').text(set.reduce(reducer));
        }
        return [set];
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailcombs = GetGrossIncome(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    ArraySum(combs);
    return combs;
};

// Get all income combination sums
function ArraySum(arr){
    var sums = [];
    $(arr).each(function(i){
        var comb = arr[i];
        var sum = 0;
        $(comb).each(function(j){
            sum += comb[j];
        })
        if($.inArray(sum, sums) === -1)
            sums.push(sum);
    })
    $('#gross').text(sums.sort().toString());
};