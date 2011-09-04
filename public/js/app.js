Todos = SC.Application.create();

Todos.Todo = SC.Resource.define({
  url: '/todos',
  schema: {
    id:     String,
    title:  String,
    isDone: Boolean
  }
});

Todos.todosController = SC.ResourceCollection.create({
  type: Todos.Todo,

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title || '', isDone: false });
    todo.save().done(function() {
      Todos.todosController.pushObject(todo);
    })
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(function(todo) {
      todo.destroy().done(function() {
        Todos.todosController.removeObject(todo);
      })
    });
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = SC.View.extend({
  remainingBinding: 'Todos.todosController.remaining',

  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
});

Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
    }
  }
});
