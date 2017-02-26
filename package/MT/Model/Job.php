<?php
/**
 * Created by PhpStorm.
 * User: Hi
 * Date: 11/04/2016
 * Time: 11:24 AM
 */

namespace ADX\Model;

use ADX\Entity;
use ADX\Config;

class Job extends Entity\Job
{
    const CHANNEL_PUBLISH_V1_ELASTIC_RSYNC = 'adx_v1:elastic:rsync';
    const CHANNEL_PUBLISH_V1_CAMPAIGN_UPDATED = 'adx_v1:campaign:updated';

    const CHANNEL_CACHING_USER_INFO = 'adx_v3:caching:user:info';
    const CHANNEL_CACHING_USER_SUPPORT = 'adx_v3:caching:user:support';

    //Define channel worker redis index ES.
    const CHANNEL_LINEITEM = 1;
    const CHANNEL_CAMPAIGN = 2;
    const CHANNEL_CREATIVE = 3;

    const CHANNEL_EVENT_CREATE = 4;
    const CHANNEL_EVENT_UPDATE = 5;
    const CHANNEL_EVENT_DELETE = 6;
    //
    const TYPE_DELETE_CP_SECTION = 1;
    const TYPE_DELETE_CP_TOPIC = 2;
    const TYPE_DELETE_CP_INTEREST = 3;
    const TYPE_DELETE_CP_INMARKET = 4;
    const TYPE_DELETE_CP_REMARKETING = 5;
    const TYPE_DELETE_CP_AGE = 6;
    const TYPE_DELETE_CP_GENDER = 7;

    public static function renderChannelName()
    {
        return array(
            self::CHANNEL_LINEITEM => 'lineitem',
            self::CHANNEL_CREATIVE => 'creative',
            self::CHANNEL_CAMPAIGN => 'campaign',
        );
    }

    public static function renderEventChannel()
    {
        return array(
            self::CHANNEL_EVENT_CREATE => 'created',
            self::CHANNEL_EVENT_UPDATE => 'updated',
            self::CHANNEL_EVENT_DELETE => 'deleted'
        );
    }

    public static function getChannelV1()
    {
        return array(
            /*self::CHANNEL_PUBLISH_V1_CAMPAIGN_CREATED,
            self::CHANNEL_PUBLISH_V1_CAMPAIGN_UPDATED,
            self::CHANNEL_PUBLISH_V1_SECTION_UPDATED,
            self::CHANNEL_PUBLISH_V1_SECTION_CREATED*/
            self::CHANNEL_PUBLISH_V1_ELASTIC_RSYNC,
//            self::CHANNEL_PUBLISH_V1_CAMPAIGN_UPDATED
        );
    }

    public static function getChannel()
    {
        //Get Configuration
        $channelName = self::renderChannelName();
        $channelEvent = self::renderEventChannel();

        $instance = 'info_buyer';
        $config = Config::get('pubsub');
        $configArray = $config['redis']['adapters'][$instance];

        foreach ($channelName as $channelKey => $name) {
            foreach ($channelEvent as $evenKey => $event) {
                $arrChannel[] = strtolower($configArray['prefix'] . ':' . $name . ':' . $event);
            }
        }

        return $arrChannel;
    }

    public static function getColumnsCampaign()
    {
        return array('CAMPAIGN_ID', 'USER_ID', 'NETWORK_ID', 'BRAND_ID', 'ADS_ID', 'CAMPAIGN_NAME', 'STATUS',
            'TOTAL_BUDGET', 'DAILY_BUDGET', 'TOTAL_CLICK', 'DAILY_CLICK', 'TOTAL_IMP', 'DAILY_IMP', 'REVENUE_TYPE',
            'FROM_DATE', 'TO_DATE', 'DEBIT_BUDGET', 'SPENT_BUDGET', 'SPENT_CLICK', 'SPENT_IMP', 'SPENT_INSTALL',
            'IS_REFUND', 'CTIME', 'UTIME', 'MANAGER_ID', 'TYPE', 'CAMP_RESOURCE_TYPE', 'CAMP_PAYMENT_MODEL', 'BID_PRICE',
            'CAMP_PROPERTIES', 'PACKAGE_ID', 'CAMP_BIDDING_INFO', 'TOTAL_INSTALL', 'DAILY_INSTALL', 'SPENT_DATE',
            'IS_RTB', 'CONTRACT_ID', 'SALE_ID', 'LINEITEM_ID', 'OPERATIONAL_STATUS');
    }

    public static function getColumnsCreative()
    {
        return array(
            'CREATIVE_ID', 'CREATIVE_NAME', 'GROUP_ID', 'MANAGER_ID', 'PLACEMENT_ID', 'CAMPAIGN_ID', 'USER_ID', 'NETWORK_ID', 'RESOURCE_ID', 'ADS_ID', 'CLICK_URL',
            'FROM_DATE', 'TO_DATE', 'DISCOUNT', 'DAILY_BUDGET', 'TOTAL_BUDGET', 'DAILY_IMP', 'TOTAL_IMP', 'DAILY_CLICK', 'TOTAL_CLICK',
            'FILES', 'STATUS', 'FORMAT', 'UNIT_PRICE', 'RUN_TYPE', 'TIME_FRAMES', 'BOOKING_EXPIRE', 'CONTRACT_NO', 'ANNEX_CONTRACT_NO',
            'CONTRACT_NOTE', 'THIRD_PARTY_URL', 'FREQ_LIFETIME', 'FREQ_DAILY', 'FREQ_HOURLY', 'CONTENT', 'PROPERTIES', 'CATEGORY_ID',
            'META_DATA', 'DISPLAY_URL', 'GENDER_TARGET', 'LOCATIONS_TARGET', 'PAYMENT_MODEL', 'AGE_TARGET', 'MFR_TARGET', 'OS_TARGET',
            'CARRIER_TARGET', 'PRIORITY', 'APPORTION', 'DAILY_INSTALL', 'TOTAL_INSTALL', 'CREATIVE_SIGNATURE', 'IS_COMMIT', 'TOTAL_DAY',
            'BRAND_ID', 'MERCHANT_WEBSITE_ID', 'MERCHANT_FILE_ID', 'MERCHANT_CATEGORY_ID', 'MERCHANT_PRICE_ID', 'IS_BIDDING', 'BIDDING_INFO',
            'WIDTH', 'HEIGHT', 'FILTER_CONDITION', 'LINEITEM_ID', 'OPERATIONAL_STATUS'
        );
    }

    public static function getColumnObject($object_type)
    {
        switch ($object_type) {
            case Common::TARGET_TOPIC: {
                $arr_column = array('TOPIC_ID', 'CAMPAIGN_ID', 'NETWORK_ID', 'LINEITEM_ID', 'STATUS', 'BID_PRICE', 'PAYMENT_MODEL', 'CTIME', 'UTIME', 'IS_CUSTOM_PRICE', 'ADS_ID');
                break;
            }
            case Common::TARGET_WEBSITE: {
                $arr_column = array('SECTION_ID', 'CAMPAIGN_ID', 'NETWORK_ID', 'LINEITEM_ID', 'STATUS', 'BID_PRICE', 'PAYMENT_MODEL', 'CTIME', 'UTIME', 'IS_CUSTOM_PRICE', 'IS_BIDDING', 'ADS_ID');
                break;
            }
            case Common::TARGET_AGE: {
                $arr_column = array('DEMOGRAPHIC_ID', 'CAMPAIGN_ID', 'TYPE', 'NETWORK_ID', 'LINEITEM_ID', 'STATUS', 'BID_PRICE', 'PAYMENT_MODEL', 'CTIME', 'UTIME', 'IS_CUSTOM_PRICE', 'IS_BIDDING', 'ADS_ID');
                break;
            }
            case Common::TARGET_GENDER: {
                $arr_column = array('DEMOGRAPHIC_ID', 'CAMPAIGN_ID', 'TYPE', 'NETWORK_ID', 'LINEITEM_ID', 'STATUS', 'BID_PRICE', 'PAYMENT_MODEL', 'CTIME', 'UTIME', 'IS_CUSTOM_PRICE', 'IS_BIDDING', 'ADS_ID');
                break;
            }
            default: {
                $arr_column = array('AUDIENCE_ID', 'CAMPAIGN_ID', 'TYPE', 'NETWORK_ID', 'LINEITEM_ID', 'STATUS', 'BID_PRICE', 'PAYMENT_MODEL', 'CTIME', 'UTIME', 'IS_CUSTOM_PRICE', 'IS_BIDDING', 'ADS_ID');
                break;

            }
        }
        return $arr_column;
    }

    public static function getChannelCaching()
    {
        return array(
            self::CHANNEL_CACHING_USER_INFO,
            self::CHANNEL_CACHING_USER_SUPPORT
        );
    }

}