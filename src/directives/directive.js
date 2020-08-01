app.filter('customSplitString', function() {
    return function(input) {
        var arr = input.split(',');
        return arr;
    };
});

app.directive("whenScrolled", function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            raw = elem[0];

            elem.bind("scroll", function() {
                if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
                    scope.loading = true;
                    scope.$apply(attrs.whenScrolled);
                }
            });
        }
    }
});

app.filter('limitChar', function() {
    return function(content, length, tail) {
        if (isNaN(length))
            length = 50;

        if (tail === undefined)
            tail = "...";

        if (content.length <= length || content.length - tail.length <= length) {
            return content;
        } else {
            return String(content).substring(0, length - tail.length) + tail;
        }
    };
});

app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});

app.filter('plaintext', function() {
    return function(text) {
        if (text) {
            var normalText = String(text).replace(/<[^>]+>/gm, '');
            return String(normalText).replace('&nbsp;', ' ');
        } else
            return '';
    };
});

app.directive('aDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!(" + tAttrs["aDisabled"] + ") && (" + tAttrs["ngClick"] + ")";

            //return a link function
            return function(scope, iElement, iAttrs) {

                //Toggle "disabled" to class when aDisabled becomes true
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});