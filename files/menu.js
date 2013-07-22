function Menu(mocklist, user) {
  this.page_mocklist_ = mocklist;
  this.page_mocklist_.addListener(this.mockListListener_.bind(this), false);
  this.signed_in_ = user.signed_in;

  // Doesn't contain valid mocklist data, just id and name.
  this.mocklists_ = user.mocklists;
  this.username_ = user.name;
  this.sign_in_url_ = user.sign_in_url;
  this.sign_out_url_ = user.sign_out_url;

  // Edit controls (right side).
  this.node_ = createElement('div', 'home', document.body);

  /*
  var opt = new Option("Your mocks:", "", false, false);
  this.node_menu_.options[this.node_menu_.length] = opt;
  addEventListener(this.node_menu_, 'change', this.menuChanged_.bind(this));
  */

  this.node_left_ = createElement('div', 'leftbar', document.body);
  this.node_right_ = createElement('div', 'rightbar', document.body);

  this.node_new_ = createElement('a', 'menuitem', this.node_left_);
  this.node_new_.href = '/';

  if (this.signed_in_) {
    this.node_name_ = createElement('a', 'menuitem', this.node_);
    setText(this.node_name_, this.username_);

    this.node_sign_ = createElement('a', 'menulink', this.node_left_);
    this.node_sign_.href = this.sign_out_url_;
    setText(this.node_sign_, "Sign out");
  } else {
    this.node_sign_ = createElement('a', 'menulink', this.node_left_);
    this.node_sign_.href = this.sign_in_url_;

    this.node_new_.className = 'menuitem button';
    setText(this.node_sign_, "Sign in");
  }  

  this.node_menu_ = new MenuMocks('Your mocks', this.node_left_);

  //this.node_about_ = createElement('a', 'menulink', this.node_left_);
  //setText(this.node_about_, 'About');
  // this.node_about_.href = '#';
  //this.node_about_.addEventListener("click", this.handleAbout_.bind(this), false);
    

  this.node_tweet_ = createElement('div', 'menuitem', this.node_right_);
  this.node_tweet_.innerHTML = '<a href="http://twitter.com/share" class="twitter-share-button" data-text="I liked this gallery on dropmocks:" data-count="none">Share on Twitter</a>';

  var twitter_script = document.createElement('script');
  twitter_script.async = true;
  twitter_script.src = 'http://platform.twitter.com/widgets.js';
  twitter_script.defer = true;
  this.node_right_.appendChild(twitter_script);
  
  this.update_();
}

Menu.prototype.mockListListener_ = function(e) {
  if (e.type == MockList.EVENT_SAVED) {
    if (!this.getMockListById(this.page_mocklist_.id)) {
      this.mocklists_.push({
        'id' : this.page_mocklist_.id,
        'name' : this.page_mocklist_.name
      });
      this.update_();
    }
  } else if (e.type == MockList.EVENT_NAMECHANGED) {
    this.getMockListById(this.page_mocklist_.id).name = this.page_mocklist_.name;
    this.update_();
  } else if (e.type == MockList.EVENT_DELETED) {
    this.node_.style.bottom = 25;
    this.node_.style.opacity = 0;
  }
}

Menu.prototype.handleAbout_ = function(e) {
  e.preventDefault();
}

Menu.prototype.getMockListById = function(id) {
  for (var i = 0, mocklist; mocklist = this.mocklists_[i]; i++) {
    if (mocklist.id == id) {
      return mocklist;
    }
  }
  return false;
}

Menu.prototype.update_ = function() {
  this.node_new_.style.display = (this.page_mocklist_.id) ? 'inline-block' : 'none';
  //this.node_left_.style.display = (this.page_mocklist_.id) ? 'block' : 'none';
  this.node_right_.style.display = (this.page_mocklist_.key || !this.page_mocklist_.id) ? 'none' : 'block';

  if (this.signed_in_ || this.page_mocklist_.key) {
    setText(this.node_new_, 'New');
    // this.node_sign_.style.display = 'inline-block';
  } else {
    setText(this.node_new_, 'Create a DropMocks gallery');
    // this.node_sign_.style.display = 'none';
  }

  this.node_menu_.clearItems();
  if (this.mocklists_.length == 0) {
    this.node_menu_.setVisible(false);
  } else {
    for (var i = 0, mocklist; mocklist = this.mocklists_[i]; i++) {
      var selected = (mocklist.id == this.page_mocklist_.id);
      var name = mocklist.name ? mocklist.name : mocklist.id;
      this.node_menu_.addItem(name, '/m' + mocklist.id, selected);
    }
    this.node_menu_.setVisible(true);
  }

  // this.node_menu_.style.display = (this.mocklists_.length) ? 'inline-block' : 'none';
}
/*
Menu.prototype.menuChanged_ = function() {
  var v = this.node_menu_.value;
  if (v) {
    window.location.href = MockList.URL_VIEWER_BASE + v;
  }
}
*/