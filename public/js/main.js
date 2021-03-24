$(document).ready(function() {
  //regex
  var emailEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var passEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;


  //custom functions
  const ErrorMsg = function (e, msgs) {
    e.preventDefault();
    msgs.forEach((msg)=> {
      $('.alert-modal-body').append(`<p>${msg}</p>`);
    })
    $("#alert-modal").modal();
  }


  //
  $(".no-script").hide();
  //
  $("#signUp").on('click', function () {
    $("#container").addClass("right-panel-active");
  })
  //
  $("#signIn").on('click', function () {
    $("#container").removeClass("right-panel-active");
  })


  //logout
  $(document).on('click', "#logout-toggler", function() {
    $('#modal-body').text('ARE YOU SURE YOU WANT TO LOGOUT?');
    $("#confirm-modal").modal()
    $("#confirm-form").prop("action", "/logout")
    $("#confirm-form").on('submit', function() {
      $(this).submit()
    })
  })


  //delete
  $(document).on('click', ".deleteTask", function() {
    $('#delete-modal-body').text('ARE YOU SURE YOU WANT TO DELETE?');
    var id = $(this).attr('data-id')
    $("#delete-modal").modal()
    $("#delete-form").prop("action", "/task/delete-task")
    $("#delete-form").prop("method", "post")
    $("#delete-form").on('submit', function(e) {
      $.post("/task/delete-task", {
        id: id.toString()
      })
      .done(function(data) {
        $("#delete-modal").modal('hide')
        $('.boxed').load(location.href + " .boxed");
      })
      .fail(function () {
        alert("failed", err)
      })
      e.preventDefault()
    })
  })


  //show task modal
  $(document).on('click', ".newTask", function() {
    $("#close, #add").show()
    $("#todo-title, #todo-text").prop("disabled", false)
    $("#todo-title, #todo-text").val('')
    $("#todo-modal").modal()
  })


  //show all task
  $(document).on('click', '.singleTask', function() {
    $("#close, #add").hide()
    $("#todo-title, #todo-text").prop("disabled", true)
    $("#todo-title, #todo-text").css({
      "background": "white"
    })
    var id = $(this).attr('data-id')

    $.post('/task/get-task', {
      id: id.toString()
    })
    .done(function(data) {
      $("#todo-title").val(data.title.toString())
      $("#todo-text").val(data.body.toString())
    })
    .fail(function(err) {
      alert("failed", err)
    })
    $("#todo-modal").modal()
  })


  //sign-up
  $(document).on('submit', "#sign_up_form", function (e) {
    var errors = []

    $('.alert-modal-body').text('')
    var username = $('[name="username"]')
    var email = $('[name="email"]')
    var password = $('[name="password"]')
    if ((username.val().length < 3) || (username.val().length > 50)) {
      errors.push("Username should be Atleast 3 characters");
    }
    if (!(passEx.test(password.val()))) {
      errors.push(`Password must contain atleast 6 characters with a lowercase, an uppercase and a digit`);
    }
    if (!(emailEx.test(email.val()))) {
      errors.push("Please enter a valid email");
    }
    if (errors.length > 0) {
      ErrorMsg(e, errors)
      return;
    }
  })


  //sign_in
  $(document).on('submit',
    "#sign_in_form",
    function (e) {
      var errors = []

      $('.alert-modal-body').text('')
      var username = $('[name="login_username"]')
      var password = $('[name="login_password"]')
      if ((username.val().length < 3) || (username.val().length > 50)) {
        errors.push("Username should be Atleast 3 characters");
      }
      if (!(passEx.test(password.val()))) {
        errors.push(`Password must contain atleast 6 characters with a lowercase, an uppercase and a digit`);
      }
      if (errors.length > 0) {
        ErrorMsg(e, errors)
        return;
      }
    })

  //mark as done
  $(document).on('click',
    "#markDone",
    function () {
      var id = $(this).attr("data-id")
      $.post('/task/mark-done', {
        id: id.toString()
      })
      .done(function(data) {
        $('.boxed').load(location.href + " .boxed");
      })
      .fail(function() {
        alert("failed")
      })

    })


  //add a new task
  $(document).on('submit',
    "#add_task",
    function (e) {
      var title = $("#todo-title").val()
      var todotext = $("#todo-text").val()

      $.post('/task/add-task', {
        title: title.toString(),
        body: todotext.toString()
      })
      .done(function(data) {
        $("#todo-title").val('')
        $("#todo-text").val('')
        $("#todo-modal").modal('hide')
        $("#tasklist").prepend(`<li class="list-group-item">

          <div class="todo-indicator bg-warning"></div>
          <div class="widget-content p-0">
          <div class="widget-content-wrapper">
          <div class="widget-content-left mr-2">
          </div>
          <div data-id="${data.id}" class="singleTask widget-content-left">
          <div class="widget-heading">
          ${data.title}
          </div>
          <div class="widget-subheading">
          <i>${data.createdAt}</i>
          </div>
          </div>
          <div class="widget-content-right">

          <button data-id="${data.id}" id="markDone" class="border-0 btn-transition btn btn-outline-success"> <i class="fa fa-check"></i></button>
          <button data-id="${data.id}" class="deleteTask border-0 btn-transition btn btn-outline-danger"> <i class="fa fa-trash"></i> </button>
          </div>
          </div>
          </div>
          </li>`)
        $('.boxed').load(location.href + " .boxed");
      })
      .fail(function() {
        alert("failed")
      })
      e.preventDefault()

    })


})