var sinon  = require("sinon");
var should = require("should");

// Instantiate a fake dom. We must do it before requiring React, otherwise we'll
// get an Invariant Violation error. See http://stackoverflow.com/a/26872245 for
// details.
require("../../test-dom.js")("<html><body></body></html>");

var React = require("react/addons");
var u = React.addons.TestUtils;

var SimpleStringList = require("inputs/simple-string-list.jsx");

var reg = function (string) {
    return new RegExp(string);
};

describe("SimpleStringList", function () {

    it("should contain a text input", function () {
        var input = u.findRenderedDOMComponentWithTag(
            u.renderIntoDocument(<SimpleStringList ctx={{}} />),
            "input"
        );
        input.props.type.should.equal("text");
    });

    it("should contain a button", function () {
        u.findRenderedDOMComponentWithTag(
            u.renderIntoDocument(<SimpleStringList ctx={{}} />),
            "button"
        );
    });

    it("should add strings on button click", function () {
        var onChange = sinon.spy();
        var simpleStringList = u.renderIntoDocument(<SimpleStringList ctx={{}} onChange={onChange} />);
        simpleStringList.getDOMNode().innerHTML.should.not.match(reg("My string"));
        var input = u.findRenderedDOMComponentWithTag(simpleStringList, "input").getDOMNode();
        var button = u.findRenderedDOMComponentWithTag(simpleStringList, "button").getDOMNode();
        React.addons.TestUtils.Simulate.change(input, {target: {value: "My string"}});
        input.value.should.equal("My string");
        React.addons.TestUtils.Simulate.click(button);
        onChange.called.should.equal(true);
        simpleStringList.getDOMNode().innerHTML.should.match(reg("My string"));
        input.value.should.equal("");
    });

    it("should add strings on enter", function () {
        var onChange = sinon.spy();
        var simpleStringList = u.renderIntoDocument(<SimpleStringList ctx={{}} onChange={onChange} />);
        simpleStringList.getDOMNode().innerHTML.should.not.match(reg("My string"));
        var input = u.findRenderedDOMComponentWithTag(simpleStringList, "input").getDOMNode();
        React.addons.TestUtils.Simulate.change(input, {target: {value: "My string"}});
        input.value.should.equal("My string");
        React.addons.TestUtils.Simulate.keyPress(input, {key: "Enter"});
        onChange.called.should.equal(true);
        simpleStringList.getDOMNode().innerHTML.should.match(reg("My string"));
        input.value.should.equal("");
    });

    it("should remove strings", function () {
        var onChange = sinon.spy();
        var simpleStringList = u.renderIntoDocument(<SimpleStringList ctx={{}} onChange={onChange} value={["My string"]} />);
        simpleStringList.getDOMNode().innerHTML.should.match(reg("My string"));
        var strings = u.findAllInRenderedTree(simpleStringList, function (node) {
            return (
                typeof node.props.onClick === "function" &&
                node.props.type !== "button"
            );
        });
        var string = strings[0].getDOMNode();
        React.addons.TestUtils.Simulate.click(string);
        onChange.called.should.equal(true);
        simpleStringList.getDOMNode().innerHTML.should.not.match(reg("My string"));
    });

});
