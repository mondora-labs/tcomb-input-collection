var chunk    = require("lodash.chunk");
var keys     = require("lodash.keys");
var includes = require("lodash.includes");
var React    = require("react/addons");
var t        = require("tcomb-form");

var InputMixin = require("../mixins/input.js");

var getAllowedValues = function (type) {
    if (type.meta.kind === "enums") {
        return keys(type.meta.map);
    } else {
        return getAllowedValues(type.meta.type);
    }
};

var Checkbox = React.createClass({
    propTypes: {
        element: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool.isRequired,
        check: React.PropTypes.func.isRequired,
        uncheck: React.PropTypes.func.isRequired
    },
    toggle: function (index) {
        if (this.props.checked) {
            this.props.uncheck();
        } else {
            this.props.check();
        }
    },
    render: function () {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={this.props.checked}
                        onChange={this.toggle}
                    />
                    {" "}
                    {this.props.element}
                </label>
            </div>
        );
    }
});

var MultiselectInput = React.createClass({
    mixins: [
        InputMixin
    ],
    getDefaultProps: function () {
        return {
            value: []
        };
    },
    addListElement: function (listElement) {
        return (function () {
            var newValue = [].concat(
                this.state.value,
                // Wrap it in an array in order to prevent unwanted bahaviour if the
                // listElement is itself an array (in which case, its elements would
                // be concat-ed)
                [listElement]
            );
            this.onChange(newValue);
        }).bind(this);
    },
    removeListElement: function (listElement) {
        return (function () {
            var currentValue = this.state.value;
            var index = currentValue.indexOf(listElement);
            var newValue = [].concat(
                currentValue.slice(0, index),
                currentValue.slice(index + 1)
            );
            this.onChange(newValue);
        }).bind(this);
    },
    renderCheckboxes: function (columns) {
        columns = columns || 1;
        var checkboxes = getAllowedValues(this.props.ctx.report.type)
            .map((function (value) {
                var className = "col-xs-" + Math.round(12 / columns);
                return (
                    <div key={value} className={className}>
                        <Checkbox
                            element={value}
                            checked={includes(this.state.value, value)}
                            check={this.addListElement(value)}
                            uncheck={this.removeListElement(value)}
                        />
                    </div>
                );
            }).bind(this));
        return chunk(checkboxes, columns)
            .map(function (checkboxesChunk, index) {
                return (
                    <div key={index}>
                        {checkboxesChunk}
                    </div>
                );
            });
    },
    render: function () {
        var opts = this.props.options || {};
        var config = opts.config || {};
        var ctx = this.props.ctx;
        var label = opts.label;
        if (!label && ctx.auto === "labels") {
            label = ctx.getDefaultLabel();
        }
        var error = t.Func.is(opts.error) ? opts.error(this.state.value) : opts.error;
        var componentClass = [
            "form-group",
            this.state.hasError ? "has-error" : ""
        ].join(" ");
        var buttonClass = [
            "btn",
            this.state.hasError ? "btn-danger" : "btn-default"
        ].join(" ");
        return (
            <div className={componentClass}>
                {label ? <label className="control-label">{label}</label> : null}
                {this.renderCheckboxes(config.columns)}
                {this.state.hasError ? <span className="help-block error-block">{error}</span> : null}
                {opts.help ? <span className="help-block">{opts.help}</span> : null}
            </div>
        );
    }
});

module.exports = MultiselectInput;
