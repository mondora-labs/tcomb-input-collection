var React = require("react/addons");
var t     = require("tcomb-form");

var InputMixin = require("../mixins/input.js");

var DefaultTagComponent = React.createClass({
    propTypes: {
        tag: React.PropTypes.string.isRequired,
        remove: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <span style={{display: "inline-block", marginRight: 4}} className="label label-default">
                {this.props.tag}
                {" "}
                <span style={{cursor: "pointer"}} onClick={this.props.remove}>
                    {"x"}
                </span>
            </span>
        );
    }
});

var TagsList = React.createClass({
    propTypes: {
        tags: React.PropTypes.array.isRequired,
        onTagRemove: React.PropTypes.func.isRequired,
        config: React.PropTypes.object.isRequired
    },
    remove: function (tag) {
        return (function () {
            this.props.onTagRemove(tag);
        }).bind(this);
    },
    renderTags: function () {
        var TagComponent = this.props.config.tagComponent || DefaultTagComponent;
        return this.props.tags.map((function (tag) {
            return (
                <TagComponent key={tag} tag={tag} remove={this.remove(tag)} />
            );
        }).bind(this));
    },
    render: function () {
        return (
            <div style={{width: "100%", marginBottom: 8}}>
                {this.renderTags()}
            </div>
        );
    }
});

var TagsInput = React.createClass({
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
            this.addTag();
        }
    },
    addTag: function () {
        var tag = this.state.inputValue.trim();
        if (tag !== "" && this.state.value.indexOf(tag) === -1) {
            this.onChange(this.state.value.concat(tag));
            this.setState({
                inputValue: ""
            });
        }
    },
    onTagRemove: function (tag) {
        var currentValue = this.state.value;
        var index = currentValue.indexOf(tag);
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
                <TagsList tags={this.state.value} onTagRemove={this.onTagRemove} config={config} />
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
                            onClick={this.addTag}
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

module.exports = TagsInput;
