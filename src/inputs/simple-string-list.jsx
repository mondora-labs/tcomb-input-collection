var React = require("react");
var t     = require("tcomb-form");

var List = require("./list.jsx");

var StringAdder = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    propTypes: {
        elements: React.PropTypes.array.isRequired,
        add: React.PropTypes.func.isRequired,
        options: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            string: ""
        };
    },
    onInputKeyPress: function (evt) {
        if (evt.key === "Enter") {
            this.addString();
        }
    },
    addString: function () {
        var string = this.state.string.trim();
        if (string !== "" && this.props.elements.indexOf(string) === -1) {
            this.props.add(string);
            this.setState({
                string: ""
            });
        }
    },
    render: function () {
        return (
            <div style={{marginTop: 8}} className="input-group">
                <input
                    ref="input"
                    type="text"
                    valueLink={this.linkState("string")}
                    onKeyPress={this.onInputKeyPress}
                    className="form-control"
                />
                <span className="input-group-btn">
                    <button
                        type="button"
                        onClick={this.addString}
                        className="btn btn-default"
                    >
                        {"Add"}
                    </button>
                </span>
            </div>
        );
    }
});

var StringComponent = React.createClass({
    propTypes: {
        element: React.PropTypes.string.isRequired,
        remove: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <span
                style={{display: "inline-block", marginRight: 4}}
                className="label label-default"
            >
                {this.props.element}
                {" "}
                <span style={{cursor: "pointer"}} onClick={this.props.remove}>
                    {"x"}
                </span>
            </span>
        );
    }
});

var SimpleStringList = React.createClass({
    keyGetter: function (string) {
        return string;
    },
    getValue: function () {
        return this.refs.list.getValue();
    },
    render: function () {
        return (
            <List
                ref="list"
                {...this.props}
                keyGetter={this.keyGetter}
                addComponent={StringAdder}
                elementComponent={StringComponent}
            />
        );
    }
});

module.exports = SimpleStringList;
