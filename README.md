Migrating to AngularJS Code Sample
=====================================

This is a sample application to demonstrate migrating an application from an
over-reliance on jQuery to implementing AngularJS.

BEFORE
======

The "before" code is a typical jQuery application with plenty of HTML DOM hooks
(IDs and classes) used to let jQuery reach in and manipulate our web page. The
application code also demonstrates the typical jQuery application code that
becomes a collection of event handlers and functions to manage transitions
between application states.

There are three main problems with this approach.

* It leads to code that is tightly coupled to the DOM.  Changing the DOM
means changing our application code.
* It leads to functions that do too much (Single Responsibility Principal anyone?)
* It makes our application very difficult to test with automated testing

All of these problems conspire to make the application more difficult to
maintain over time.

AFTER
=====

The "after" code is the same application but having been migrated to AngularJS.
The Angular solution is much more modular. Our views are pulled into their own
templates, the code is separated into separate files to help isolate the
responsibility of each piece of the application.
