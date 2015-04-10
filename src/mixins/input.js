var React = require("react");
var t     = require("tcomb-validation");

var InputMixin = {
    propTypes: {
        ctx: React.PropTypes.object.isRequired,
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        options: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            hasError: false,
            value: this.props.value
        };
    },
    componentWillReceiveProps: function (props) {
        this.setState({
            value: props.value
        });
    },
    triggerChange: function () {
        this.props.onChange(this.state.value);
    },
    onChange: function (value) {
        this.setState({
            value: value
        }, this.triggerChange);
    },
    getValue: function () {
        var validation = t.validate(this.state.value, this.props.ctx.report.type);
        this.setState({
            hasError: !validation.isValid()
        });
        return validation;
    }
};

module.exports = InputMixin;
