var sinon = require("sinon");
var should = require("should");

// Instantiate a fake dom. We must do it before requiring React, otherwise we'll
// get an Invariant Violation error. See http://stackoverflow.com/a/26872245 for
// details.
require("../../test-dom.js")("<html><body></body></html>");

var React = require("react/addons");
var u = React.addons.TestUtils;

var TagsInput = require("inputs/tags-input.jsx");

var reg = function (string) {
    return new RegExp(string);
};

describe("TagsInput", function () {
    it("should contain a text input", function () {
        var input = u.findRenderedDOMComponentWithTag(
            u.renderIntoDocument(<TagsInput ctx={{}} />),
            "input"
        );
        input.props.type.should.equal("text");
    });
    it("should contain a button", function () {
        u.findRenderedDOMComponentWithTag(
            u.renderIntoDocument(<TagsInput ctx={{}} />),
            "button"
        );
    });
    it("should add tags on button click", function () {
        var onChange = sinon.spy();
        var tagsInput = u.renderIntoDocument(<TagsInput ctx={{}} onChange={onChange} />);
        tagsInput.getDOMNode().innerHTML.should.not.match(reg("My tag"));
        var input = u.findRenderedDOMComponentWithTag(tagsInput, "input").getDOMNode();
        var button = u.findRenderedDOMComponentWithTag(tagsInput, "button").getDOMNode();
        React.addons.TestUtils.Simulate.change(input, {target: {value: "My tag"}});
        input.value.should.equal("My tag");
        React.addons.TestUtils.Simulate.click(button);
        onChange.called.should.equal(true);
        tagsInput.getDOMNode().innerHTML.should.match(reg("My tag"));
        input.value.should.equal("");
    });
    it("should add tags on enter", function () {
        var onChange = sinon.spy();
        var tagsInput = u.renderIntoDocument(<TagsInput ctx={{}} onChange={onChange} />);
        tagsInput.getDOMNode().innerHTML.should.not.match(reg("My tag"));
        var input = u.findRenderedDOMComponentWithTag(tagsInput, "input").getDOMNode();
        React.addons.TestUtils.Simulate.change(input, {target: {value: "My tag"}});
        input.value.should.equal("My tag");
        React.addons.TestUtils.Simulate.keyPress(input, {key: "Enter"});
        onChange.called.should.equal(true);
        tagsInput.getDOMNode().innerHTML.should.match(reg("My tag"));
        input.value.should.equal("");
    });
    it("should remove tags", function () {
        var onChange = sinon.spy();
        var tagsInput = u.renderIntoDocument(<TagsInput ctx={{}} onChange={onChange} value={["My tag"]} />);
        tagsInput.getDOMNode().innerHTML.should.match(reg("My tag"));
        var tags = u.findAllInRenderedTree(tagsInput, function (node) {
            return (
                typeof node.props.onClick === "function" &&
                node.props.type !== "button"
            );
        });
        var tag = tags[0].getDOMNode();
        React.addons.TestUtils.Simulate.click(tag);
        onChange.called.should.equal(true);
        tagsInput.getDOMNode().innerHTML.should.not.match(reg("My tag"));
    });
});
