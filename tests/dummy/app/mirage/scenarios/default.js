export default function( server ) {

  // Seed your development database using your factories. This
  // data will not be loaded in your tests.

  server.createList('manager', 2);
  server.createList('sub-manager', 3);
  server.createList('employee', 4);
  server.createList('task', 5);
  server.createList('sub-task', 6);

}
