var app = angluar.module('airbnbApp', [])

// This is how you create a custom directive
app.directive("navbar", function() {
  return {
    template: "<nav class 'navbar navbar-default' role='navigation'>" +
      " <div class='container-fluid'> " +
        " <div class='navbar-header'> " +
          " <a class='navbar-brand' href='/index.html'>AirBnB</a> " +
        " </div> " +
        " <ul class='nav navbar-nav'> " +
          " <li><a href='#'>Home</a></li> " +
        " </ul> " +
        " <ul class='nav navbar-nav pull-right'> " +
          " <li><a href='#'>Sign Up</a></li> " +
          " <li><a href='#'>Login</a></li> " +
        " </ul> " +
      " </div> " +
    " </nav>"
  }
})
