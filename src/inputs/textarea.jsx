var React = require("react/addons");
var t     = require("tcomb-form");

var InputMixin = require("../mixins/input.js");

var Textarea = React.createClass({
    mixins: [
        InputMixin
    ],
    getDefaultProps: function () {
        return {
            value: ""
        };
    },
    onInputChange: function (evt) {
        this.onChange(evt.target.value);
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
                <textarea
                    className="form-control"
                    value={this.state.value}
                    onChange={this.onInputChange}
                />
                {this.state.hasError ? <span className="help-block error-block">{error}</span> : null}
                {opts.help ? <span className="help-block">{opts.help}</span> : null}
            </div>
        );
    }
});

module.exports = Textarea;
