import React from 'react';
import { Route } from 'react-router-dom';

function Debugger(props) {
  console.log('ROUTE DEBUGGER', props);
  return null;
}

/*
 * Simply place this inside your <Router> to log
 * locaton prop changes.
 */
export function RouteDebugger(props) {
  return (
    <Route component={Debugger} path="*" />
  );
}

