frontend-rgg-widgets
######################

Frontend widgets for **GAMMA** — *Gamification for Open edX*.

Purpose
*******

This repository is a **frontend-only storage of GAMMA widgets**.

Widgets from this repository are designed to be dynamically injected into Open edX
micro-frontends using **Plugin Slots**, without rebuilding or modifying MFEs.

Plugin Slot mechanism is provided by Open edX:

https://github.com/openedx/frontend-plugin-framework

Getting Started
***************

This repository is **not a standalone MFE**.
It is consumed by existing MFEs through plugin slots.

Widgets are installed automatically in production via a Tutor plugin.

Production Installation
=======================

In production environments, this repository is installed automatically using
the GAMMA Tutor plugin:

https://gitlab.raccoongang.com/kraken/nau/tutor-contrib-rgg

Manual NPM Registry Access (Optional)
=====================================

Direct access to the package may be required for:
- local development
- custom MFEs
- manual integration scenarios

Create a ``.npmrc`` file in the consumer MFE root:

.. code-block:: text

   @rgg-plugins:registry=https://gitlab.raccoongang.com/api/v4/projects/<GITLAB_PROJECT_ID>/packages/npm/
   //gitlab.raccoongang.com/api/v4/projects/<GITLAB_PROJECT_ID>/packages/npm/:_authToken=<CI_JOB_TOKEN>

Local Development
*****************

Local development is optimized for **instant feedback**.

Plugin Slot Override
====================

For local development, you can override plugin slot content by adding
an ``env.config.jsx`` file to the root of a local MFE.

.. code-block:: jsx

   import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
   import { AvatarProgress } from '@rgg-plugins/frontend-rgg-widgets';

   const RGG_AVATAR_PROGRESS_WIDGET_CONFIG = {
     keepDefault: true,
     plugins: [
       {
         op: PLUGIN_OPERATIONS.Insert,
         widget: {
           id: 'rgg_header_avatar_progress_widget',
           type: DIRECT_PLUGIN,
           priority: 10,
           RenderWidget: AvatarProgress,
         },
       },
     ],
   };

   const config = {
     pluginSlots: {
       'org.openedx.frontend.layout.header_desktop_secondary_menu.v1': RGG_AVATAR_PROGRESS_WIDGET_CONFIG,
       'org.openedx.frontend.layout.header_learning_help.v1': RGG_AVATAR_PROGRESS_WIDGET_CONFIG,
     },
   };

   export default config;

Local NPM Overrides
===================

To work on widgets locally without publishing them to the registry,
you can override installed NPM packages with local directories.

Create a ``module.config.js`` file in the consumer MFE root.

.. code-block:: js

   // module.config.js
   module.exports = {
     localModules: [
       { moduleName: '@rgg-plugins/frontend-rgg-widgets', dir: '../frontend-rgg-widgets', dist: 'dist' },
     ],
   };

Important
---------

Paths in ``dir`` are **container paths**, relative to the application root
inside the Tutor MFE service (typically ``/openedx/app``).

The corresponding local directories must be mounted into the Tutor service
so that Webpack can resolve them.

This setup is intended **only for local development**.
