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
    'queue' => array(
        'adapters' => array(
            'info' => array(
                'adapter' => 'gearman',
                'servers' => array(
                    array(
                        'host' => '127.0.0.1',
                        'port' => '4730',
                    ),
                ),
                'function' => array(
                    'admin_process' => KEY_PREFIX . "admin_process_job",
                    'admin_debug' => KEY_PREFIX . "admin_debug_job",
                    'admin_upload' => KEY_PREFIX . "admin_upload_job",
                    'admin_helper' => KEY_PREFIX . "admin_helper_job",
                    'admin_crawler' => KEY_PREFIX . "admin_crawler_job"
                )
            )
        )
    )
);
