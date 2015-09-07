var React = require("react/addons");
var t     = require("tcomb-form");

var InputMixin = require("../mixins/input.js");

var List = React.createClass({
    propTypes: {
        keyGetter: React.PropTypes.func,
        elements: React.PropTypes.array.isRequired,
        changeListElement: React.PropTypes.func.isRequired,
        removeListElement: React.PropTypes.func.isRequired,
        elementComponent: React.PropTypes.func.isRequired,
        options: React.PropTypes.object.isRequired
    },
    remove: function (index) {
        return (function () {
            this.props.removeListElement(index);
        }).bind(this);
    },
    change: function (index) {
        return (function (changedElement) {
            this.props.changeListElement(index, changedElement);
        }).bind(this);
    },
    renderElements: function () {
        return this.props.elements.map((function (element, index) {
            var key = this.props.keyGetter ? this.props.keyGetter(element) : index;
            return (
                <this.props.elementComponent
                    key={key}
                    element={element}
                    change={this.change(index)}
                    remove={this.remove(index)}
                    options={this.props.options}
                />
            );
        }).bind(this));
    },
    render: function () {
        return (
            <div>
                {this.renderElements()}
            </div>
        );
    }
});

var ListInput = React.createClass({
    mixins: [
        InputMixin
    ],
    propTypes: {
        keyGetter: React.PropTypes.func,
        addComponent: React.PropTypes.func.isRequired,
        elementComponent: React.PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        return {
            value: []
        };
    },
    addListElement: function (listElement) {
        var newValue = [].concat(
            // If this.props.value is null, the default value prop is not used,
            // therefore this.state.value results null. It's a (fixed) bug in
            // tcomb-form. Since we can't update tcomb-form, we're stuck with it
            this.state.value || [],
            // Wrap it in an array in order to prevent unwanted bahaviour if the
            // listElement is itself an array (in which case, its elements would
            // be concat-ed)
            [listElement]
        );
        this.onChange(newValue);
    },
    changeListElement: function (index, changedListElement) {
        var currentValue = this.state.value;
        var newValue = [].concat(
            currentValue.slice(0, index),
            // Wrap it in an array in order to prevent unwanted bahaviour if the
            // listElement is itself an array (in which case, its elements would
            // be concat-ed)
            [changedListElement],
            currentValue.slice(index + 1)
        );
        this.onChange(newValue);
    },
    removeListElement: function (index) {
        var currentValue = this.state.value;
        var newValue = [].concat(
            currentValue.slice(0, index),
            currentValue.slice(index + 1)
        );
        this.onChange(newValue);
    },
    render: function () {
        var opts = this.props.options || {};
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
                {/*
                    If this.props.value is null, the default value prop is not used,
                    therefore this.state.value results null. It's a (fixed) bug in
                    tcomb-form. Since we can't update tcomb-form, we're stuck with it
                */}
                <List
                    keyGetter={this.props.keyGetter}
                    elements={this.state.value || []}
                    elementComponent={this.props.elementComponent}
                    changeListElement={this.changeListElement}
                    removeListElement={this.removeListElement}
                    options={opts}
                />
                <this.props.addComponent
                    elements={this.state.value || []}
                    add={this.addListElement}
                    options={opts}
                />
                {this.state.hasError ? <span className="help-block error-block">{error}</span> : null}
                {opts.help ? <span className="help-block">{opts.help}</span> : null}
            </div>
        );
    }
});

module.exports = ListInput;
