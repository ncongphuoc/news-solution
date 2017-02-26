<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    'redis' => array(
        'adapters' => array(
            'info' => array(
                'prefix' => 'adx_v3',
                'component' => 'front-end',
                'host' => '10.197.0.1',
                'port' => '6501',
                'timeout' => '0'
            )
        )
    )
);