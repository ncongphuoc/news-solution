<?php
/**
 * Created by PhpStorm.
 * User: GiangBeo
 * Date: 11/24/16
 * Time: 9:33 AM
 */
namespace TASK;

use MT\Model,
    My\General;

class Test
{
    public function cloneYoutube()
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Error';
        $arrParam = [];
        try {
            $arr_tags = [
                'khampha.tech',
                'hai huoc',
                'hài hước',
                'vui nhộn',
                'funny',
                'góc thư giãn',
                'vui nhon',
                'goc hai huoc',
                'cuoi vo bung',
                'cười vỡ bụng',
                'cười bể bụng bò',
                'goc hai huoc',
                'cười',
                'cuoi',
                'zui la chinh',
                'vui là chính',
                'video hài hước',
                'clip hài hước'
            ];

            $arr_channel = [
                'UCj6B4cj9mB9JXWW65T4Sh4w' => 24,
                'UCrKjPCoN3d7s1_YzmMdOXbg' => 17,
                'UCW7WlDN4HSD8kopuN5ZflbQ' => 17,
                'UC7kEGojK79YjOeHMhR9IYiA' => 17,
                'UCL0dxOYvGs_bdEQHA1ljN-g' => 24,
                'UCeAlYe-FDWztQrEnxKhXUDA' => 24,
                'UCXVmFKJdknhsl-Co6gUAhOA' => 17,
                'UCvTkvGaMmBCXbqkxpjhne3g' => 24,
                'UCp09s-igQEpsIet-qyD6Vcw' => 24,
                'UCBy4rpjPI1NPZhBV4d3SnLg' => 17, //Videos hot
                'UC8h2O0acnepicR8mxk667xw' => 17, //hoat hinh
                'UCWhkVvXZfdRV0SnYKPEBjJg' => 17,
                'UCqImkRdgV9OZtfrmf7-2Ukw' => 17,
                'UCZNoTFTsrWXA-dXElRm90bA' => 24,
                'UCoXlAYmyv1oXX1HdgJA3uGA' => 17,
                'UCn0GEHVGyWYKdEBzjRGJk4g' => 17
            ];

            $google_config = \My\General::$google_config;
            $client = new \Google_Client();
            $client->setDeveloperKey($google_config['key']);

            // Define an object that will be used to make all API requests.
            $youtube = new \Google_Service_YouTube($client);

            foreach ($arr_channel as $channelId => $categoryId) {
                $token_page = null;
                for ($page = 0; $page <= 1000; $page++) {
                    if ($page == 0) {
                        $searchResponse = $youtube->search->listSearch(
                            'snippet', array(
                                'channelId' => $channelId,
                                'maxResults' => 50
                            )
                        );
                    } else {
                        if (empty($token_page)) {
                            break;
                        }
                        $searchResponse = $youtube->search->listSearch(
                            'snippet', array(
                                'channelId' => $channelId,
                                'maxResults' => 50,
                                'pageToken' => $token_page
                            )
                        );
                    }

                    if (empty($searchResponse) || empty($searchResponse->getItems())) {
                        break;
                    }

                    $token_page = $searchResponse->getNextPageToken();

                    foreach ($searchResponse->getItems() as $item) {
                        if (empty($item) || empty($item->getSnippet())) {
                            continue;
                        }

                        $id = $item->getId()->getVideoId();

                        if (empty($id)) {
                            continue;
                        }

                        $redis = \MT\Nosql\Redis::getInstance('caching');

                        if ($redis->GET('vd:' . $id)) {
                            continue;
                        }

                        //title video
                        $title = $item->getSnippet()->getTitle();
                        if (!$title) {
                            continue;
                        }

                        $status = $redis->SET('vd:' . $id, true);

                        if (!$status) {
                            continue;
                        }

                        //get info video
                        $url = 'http://www.youtube.com/get_video_info?&video_id=' . $id . '&asv=3&el=detailpage&hl=en_US';
                        $rp = General::crawler($url);
                        $thumbnail_url = $title = $url_encoded_fmt_stream_map = $type = $url = '';
                        parse_str($rp);
                        $my_formats_array = explode(',', $url_encoded_fmt_stream_map);

                        if (empty($url_encoded_fmt_stream_map)) {
                            continue;
                        }

                        $path = '/var/ydownload/' . General::getSlug($title) . '_' . $id . '.mp4 "';

                        $avail_formats[] = '';
                        $j = 0;
                        $ipbits = $ip = $itag = $sig = $quality = '';
                        $expire = time();
                        foreach ($my_formats_array as $format) {
                            parse_str($format);
                            $avail_formats[$j]['itag'] = $itag;
                            $avail_formats[$j]['quality'] = $quality;
                            $type = explode(';', $type);
                            $avail_formats[$j]['type'] = $type[0];
                            $avail_formats[$j]['url'] = urldecode($url) . '&signature=' . $sig;
                            parse_str(urldecode($url));
                            $avail_formats[$j]['expires'] = date("G:i:s T", $expire);
                            $avail_formats[$j]['ipbits'] = $ipbits;
                            $avail_formats[$j]['ip'] = $ip;
                            $j++;
                        }

                        exec('wget -O ' . $path . $avail_formats[0]['url'] . '"');
                        $arr_tags[] = $title;

                        \MT\Utils::runJob(
                            'info',
                            'TASK\Test',
                            'uploadYt',
                            'doHighBackgroundTask',
                            'admin_upload',
                            [
                                'title' => $title,
                                'categoryId' => $categoryId,
                                'path' => $path,
                                'tags' => $arr_tags,
                                'description' => '
                                Tổng hợp clip vui nhộn, hài hước <br>
                                Chúc các bạn có những giây phút thư giãn thật vui vẻ <br>
                                <a href="http://khampha.tech">Khám phá khoa học</a>
                            ',
                                'action' => __FUNCTION__
                            ]
                        );

                        continue;
                    }
                }
            }
            \MT\Utils::writeLog($fileNameSuccess, $arrParam);
        } catch
        (\Exception $e) {
            $arrParam['exc'] = [
                'code' => $e->getCode(),
                'messages' => $e->getMessage()
            ];
            \MT\Utils::writeLog($fileNameError, $arrParam);
        }
    }

    public function uploadYt($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $arrParam = [
            'params_input' => $params
        ];
        try {
            //token youtube
            $redis = \MT\Nosql\Redis::getInstance('caching');
            $token = $redis->HGET('token:youtube', 'access_token');

            $google_config = General::$google_config;
            $client = new \Google_Client();
            $client->setClientId($google_config['client_id']);
            $client->setClientSecret($google_config['client_secret']);
            $client->setScopes('https://www.googleapis.com/auth/youtube');

            // Define an object that will be used to make all API requests.
            $youtube = new \Google_Service_YouTube($client);
            $client->setAccessToken($token);

            //snippet
            $snippet = new \Google_Service_YouTube_VideoSnippet();
            $snippet->setTitle($params['title']);
            $snippet->setDescription($params['description']);
            $snippet->setTags($params['tags']);
            $snippet->setCategoryId($params['categoryId']);

            //status
            $status = new \Google_Service_YouTube_VideoStatus();
            $status->privacyStatus = "public";

            //videos
            $video = new \Google_Service_YouTube_Video();
            $video->setSnippet($snippet);
            $video->setStatus($status);

            $chunkSizeBytes = 1 * 1024 * 1024;
            $client->setDefer(true);

            $insertRequest = $youtube->videos->insert("status,snippet", $video);

            // Create a MediaFileUpload object for resumable uploads.
            $media = new \Google_Http_MediaFileUpload(
                $client,
                $insertRequest,
                'video/*',
                null,
                true,
                $chunkSizeBytes
            );
            $media->setFileSize(filesize($params['path']));

            $status = false;
            $handle = fopen($params['path'], "rb");
            while (!$status && !feof($handle)) {
                $chunk = fread($handle, $chunkSizeBytes);
                $status = $media->nextChunk($chunk);
            }

            fclose($handle);

            // If you want to make other calls after the file upload, set setDefer back to false
            $client->setDefer(false);

            if (!empty($status['id'])) {
                @unlink($params['path']);
            }
            \MT\Utils::writeLog($fileNameSuccess, $arrParam);
        } catch (\Exception $e) {
            $arrParam['exc'] = [
                'code' => $e->getCode(),
                'messages' => $e->getMessage()
            ];
            \MT\Utils::writeLog($fileNameError, $arrParam);
        }
    }
}