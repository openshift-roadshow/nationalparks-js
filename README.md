# National Parks web service (JS)

[![Dependency Check](http://img.shields.io/david/openshift-roadshow/nationalparks-js.svg)](https://david-dm.org/openshift-roadshow/nationalparks-js)

## Usage

To launch this demo, login to your OpenShift cluster and select a project, then run:

```bash
oc create -f nationalparks-js.json
oc new-app nationalparks-example
```

Next, populate the database:
```bash
curl $(oc get routes/nationalparks --template={{.spec.host}}/ws/data/load)
```

Then, view the resulting map solution in your browser of choice:
```bash
firefox $(oc get routes/parksmap --template={{.spec.host}})
```

### Local Dev
Source js dependencies:

    npm install

Start a local webserver:

    npm start

Your dev server should be available at the default address: [localhost:8080](http://localhost:8080)
