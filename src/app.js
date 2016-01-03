var Showdown = require("showdown")

var firebaseUrl = "https://constructive.firebaseio.com/";

var converter = new Showdown.Converter();


var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <div className="demo-card-event mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand">
          <div className="card_contents">
            <h4>
              {this.props.author}:
            </h4>
            <h3>  
            <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </h3>
          </div>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Thank
            </a>
            <div className="mdl-layout-spacer"></div>
            <i className="material-icons">face</i>
          </div>
        </div>
      </div>

    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });
    return <div className="commentList">{commentNodes}</div>;
  }
});


var CommentForm = React.createClass({
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },

  render: function() {
    return (
      <form action="#" className="commentForm" onSubmit={this.handleSubmit}>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="author" type="text" id="author"/>
          <label className="mdl-textfield__label" for="author">Your name</label>
        </div>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="text" type="text" id="text"/>
          <label className="mdl-textfield__label" for="text">Appreciation</label>
        </div>
        <button type="submit" onclick={this.handleSubmit}className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
          Offer
        </button>
      </form>
    );
  }
});


var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(comment) {
    // Here we push the update out to Firebase and let ReactFire update this.state.data
    this.firebaseRefs["data"].push(comment);
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseUrl + "commentBox"), "data");
  },

  render: function() {
    return (
      <div className="commentBox">
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
