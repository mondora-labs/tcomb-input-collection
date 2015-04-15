var React = require("react/addons");
var t     = require("tcomb-form");

var Inputs = require("../");

var App = React.createClass({
    getInitialState: function () {
        return {
            value: {
                simpleStringList: ["List", "of", "strings"],
                multiselect: ["Option Two"]
            }
        };
    },
    onChange: function (value) {
        this.setState({
            value: value
        });
    },
    render: function () {
        return (
            <div className="container-fluid">
                <br />
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3">
                        <t.form.Form
                            value={this.state.value}
                            onChange={this.onChange}
                            type={t.struct({
                                simpleStringList: t.list(t.Str),
                                multiselect: t.list(t.enums.of([
                                    "Option One",
                                    "Option Two",
                                    "Option Three",
                                    "Option Four",
                                    "Option Five",
                                    "Option Six",
                                    "Option Seven"
                                ]))
                            })}
                            options={{
                                fields: {
                                    simpleStringList: {
                                        factory: Inputs.SimpleStringList
                                    },
                                    multiselect: {
                                        factory: Inputs.Multiselect,
                                        config: {
                                            columns: 3
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="col-sm-6 col-sm-offset-3">
                        <pre>{JSON.stringify(this.state.value, null, 4)}</pre>
                    </div>
                </div>
            </div>
        );
    }
});
React.render(<App />, document.body);

window.React = React;
