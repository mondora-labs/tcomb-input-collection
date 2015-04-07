var React = require("react/addons");
var t     = require("tcomb-form");

var InputMixin = require("../mixins/input.js");

var DefaultStringComponent = React.createClass({
    propTypes: {
        string: React.PropTypes.string.isRequired,
        remove: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <span style={{display: "inline-block", marginRight: 4}} className="label label-default">
                {this.props.string}
                {" "}
                <span style={{cursor: "pointer"}} onClick={this.props.remove}>
                    {"x"}
                </span>
            </span>
        );
    }
});

var List = React.createClass({
    propTypes: {
        strings: React.PropTypes.array.isRequired,
        onStringRemove: React.PropTypes.func.isRequired,
        config: React.PropTypes.object.isRequired
    },
    remove: function (string) {
        return (function () {
            this.props.onStringRemove(string);
        }).bind(this);
    },
    renderStrings: function () {
        var StringComponent = this.props.config.stringComponent || DefaultStringComponent;
        return this.props.strings.map((function (string) {
            return (
                <StringComponent key={string} string={string} remove={this.remove(string)} />
            );
        }).bind(this));
    },
    render: function () {
        return (
            <div style={{width: "100%", marginBottom: 8}}>
                {this.renderStrings()}
            </div>
        );
    }
});

var StringList = React.createClass({
    mixins: [
        React.addons.LinkedStateMixin,
        InputMixin
    ],
    getInitialState: function () {
        return {
            inputValue: ""
        };
    },
    getDefaultProps: function () {
        return {
            value: []
        };
    },
    onInputKeyPress: function (evt) {
        if (evt.key === "Enter") {
            this.addString();
        }
    },
    addString: function () {
        var string = this.state.inputValue.trim();
        if (string !== "" && this.state.value.indexOf(string) === -1) {
            this.onChange(this.state.value.concat(string));
            this.setState({
                inputValue: ""
            });
        }
    },
    onStringRemove: function (string) {
        var currentValue = this.state.value;
        var index = currentValue.indexOf(string);
        var newValue = [].concat(
            currentValue.slice(0, index),
            currentValue.slice(index + 1)
        );
        this.onChange(newValue);
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
                <List strings={this.state.value} onStringRemove={this.onStringRemove} config={config} />
                <div className="input-group">
                    <input
                        ref="input"
                        type="text"
                        disabled={opts.disabled}
                        valueLink={this.linkState("inputValue")}
                        onKeyPress={this.onInputKeyPress}
                        placeholder={opts.placeholder || "Add " + ctx.name}
                        className="form-control"
                    />
                    <span className="input-group-btn">
                        <button
                            type="button"
                            onClick={this.addString}
                            className={buttonClass}
                        >
                            {config.addButtonContent || "Add"}
                        </button>
                    </span>
                </div>
                {this.state.hasError ? <span className="help-block error-block">{error}</span> : null}
                {opts.help ? <span className="help-block">{opts.help}</span> : null}
            </div>
        );
    }
});

module.exports = StringList;
