## Development Setup

This application runs as two containers, one postgres database and one sails/backbone application

The openopps platform requires that an existing database already be set up on the database server
with a specific username and password.
```
//
// Build a postgres docker container from the postgres image on docker hub
//
you:$ docker run --name devex_postgres -e POSTGRES_PASSWORD=querty -p 5432:5432 -d postgres
//
// Enter the datbase image
//
you:$ docker exec -ti devex_postgres bash
//
// create the midas database and leave the image
//
root@image:/# createdb --username=postgres --owner=postgres midas
root@image:/# psql --username=postgres midas
midas=# create user midas with password 'midas';
midas=# grant all privileges on database midas to midas;
midas=# alter schema public owner to midas;
midas=# \q
root@image:/# exit
```
Now the database should be all set up and ready. Its time to build the application container
```
docker run -Pti -v `pwd`:/usr/src/app --entrypoint=/bin/bash --name local-opps -e BRANCH=v0.9.5 --link devex_postgres:postgres 18fgsa/open-opps
npm install
npm run init
//
// Note: demo may or may not run correctly, just skip and move to start
//
npm run demo
npm start
```
Now both containers are runing and working together and changes to the local code will be reflected in the
running application.  You may need to stop the server and restart in order to reload changes. Auto-load coming soon.

