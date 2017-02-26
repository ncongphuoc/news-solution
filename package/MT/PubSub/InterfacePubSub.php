<?php
namespace ADX\PubSub;

interface InterfacePubSub {
    public function publish($channel, $data);
    public function subscribe($channel, $callback);
}