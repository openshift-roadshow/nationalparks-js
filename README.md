# National Parks web service (JS)

[![Dependency Check](http://img.shields.io/david/openshift-roadshow/nationalparks-js.svg)](https://david-dm.org/openshift-roadshow/nationalparks-js)

## Usage

To launch this demo, login to your OpenShift cluster and select a project, then run:

```bash
oc process -f https://raw.githubusercontent.com/ryanj/nationalparks-js/master/nationalparks-js.json | oc create -f -
```

When the builds and deployments have completed, you should be able to view the resulting map solution at the following url:
```bash
oc get routes/parksmap --template={{.spec.host}}
```

## Installation
Use `oc create` to install the template, making it easily launchable by anyone who has access to the selected project scope:
```bash
oc create -f nationalparks-js.json
```

Installing the template will allow you to launch the app from the Web-based Service Catalog, or from the command-line:
```bash
oc new-app nationalparks-example
```

### Local Dev
Source js dependencies:

    npm install

Start a local webserver:

    npm start

Your dev server should be available at the default address: [localhost:8080](http://localhost:8080)
