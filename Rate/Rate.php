<?php

namespace Rate;

use RuntimeException,
    Obullo\Container\Container;

/**
 * Rate Limiter
 * 
 * @category  Security
 * @package   Limiter
 * @author    Ali İhsan Çağlayan <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://opensource.org/licenses/MIT MIT license
 * @link      http://obullo.com/docs
 */
Class Rate
{
    const CONFIG_EXPIRATION = 604800; // 1 Week (second).
    const DATA_EXPIRATION   = 604800; // 1 Week (second).

    protected $c;                   // Container
    protected $error;               // Error message
    protected $label = 'none';      // Request name "call", "sms", "otp", "login"
    protected $cache = null;        // Cache object
    protected $expiration = 7200;   // Redis cache expiration time
    protected $period = array();    // This period reduceLimit() function update the date.
    protected $isBanActive = false; // Is ban active
    protected $settings = array();  // Configurations from cache
    protected $identifier = null;   // Identifier of user
    protected $channel = null;      // Channel name of the request
    protected $logger;              // Logger service
    protected $data;                // Request data

    /**
     * Constructor
     * 
     * @param object $c        container
     * @param string $listener listener
     * @param array  $params   config
     */
    public function __construct(Container $c, $listener, $params = array())
    {
        $this->c = $c;
        $this->params = $params;
        $this->cache  = $this->c['cache'];
        $this->logger = $this->c['logger'];

        if (empty($this->params['channel']) OR empty($this->params['identifier'])) {
            throw new RuntimeException("Identifier or channel can't be empty.");
        }
        $this->identifier($this->params['identifier']);
        $this->channel($this->params['channel']);

        $this->config = new Config($this->c);
        $this->config->listener($listener);
        $this->config->channel($this->params['channel']);
        $this->config->init($this->params['config']);

        $this->run(); // Read config from cache.
    }

    /**
     * Read and run rate limiter configuration
     * 
     * @return void
     */
    public function run()
    {
        if (! empty($this->settings)) { // Lazy loading, if config was read from cache
            return;
        }
        $this->settings = $this->config->read();  // Get configuration
        $this->data = $this->cache->get('Rate:Data:'.$this->params['channel'] .':'. $this->params['identifier']); // Read request data
    }

    /**
     * Set request label
     * 
     * @param string $name request name
     * 
     * @return void
     */
    public function label($name)
    {
        $this->label = $name;
    }

    /**
     * Get request label
     * 
     * @return void
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * Set identifier
     * 
     * @param mix $identifier identifier
     * 
     * @return void
     */
    public function identifier($identifier)
    {
        $this->identifier = $identifier;
    }

    /**
     * Get unique identifier (ip, username, mobile phone)
     * 
     * @return string
     */
    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * Set channel
     * 
     * @param string $channel channel
     * 
     * @return void
     */
    public function channel($channel)
    {
        $this->channel = (string)$channel;
    }

    /**
     * Get channel
     * 
     * @return string
     */
    public function getChannel()
    {
        return $this->channel;
    }

    /**
     * Set error message.
     * 
     * @param string $error error message
     * 
     * @return void
     */
    public function setError($error)
    {
        $this->error = $error;
    }

    /**
     * Get error message.
     * 
     * @return void
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * Get period
     * 
     * @param string $period period name
     * 
     * @return boolean
     */
    public function getPeriod($period)
    {
        if ( ! isset($this->period[$period]['update']) OR $this->period[$period]['update'] == false) {
            return false;
        }
        return true;
    }

    /**
     * Reset period
     * 
     * @return void
     */
    protected function resetPeriod()
    {
        $this->period = array(
            'interval' => array(
                'date'   => '',
                'update' => false,
            ),
            'hourly' => array(
                'date'   => '',
                'update' => false,
            ),
            'daily' => array(
                'date'   => '',
                'update' => false,
            ),
        );
    }

    /**
     * Increase interval limit.,
     * 
     * @param int $intervalAmount interval amount limit
     * 
     * @return void
     */
    protected function increaseIntervalLimit($intervalAmount)
    {
        $this->config->setIntervalLimit($this->settings['limit']['interval']['amount'], $intervalAmount + 1);
    }

    /**
     * Increase daily limit.
     * 
     * @param int $hourlyAmount hourly amount limit
     * 
     * @return void
     */
    protected function increaseHourlyLimit($hourlyAmount)
    {
        $this->config->setHourlyLimit($this->settings['limit']['hourly']['amount'], $hourlyAmount + 1);
    }

    /**
     * Increase daily limit.
     * 
     * @param int $dailyAmount daily amount limit
     * 
     * @return void
     */
    protected function increaseDailyLimit($dailyAmount)
    {
        $this->config->setDailyLimit($this->settings['limit']['daily']['amount'], $dailyAmount + 1);
    }

    /**
     * Reduce interval limit.,
     * 
     * @param array $data request data
     * 
     * @return void
     */
    protected function reduceIntervalLimit($data)
    {
        if (strtotime(' - ' . $this->config->getIntervalLimit() . ' second ') < $data['period']['intervalDate']) {
            return $this->config->setIntervalLimit(
                $this->settings['limit']['interval']['amount'], 
                $data['intervalMaxRequest'] - 1
            );
        }
        $this->period['interval'] = array('date' => time(), 'update' => true);
        $this->config->setIntervalLimit(
            $this->settings['limit']['interval']['amount'], 
            $this->settings['limit']['interval']['maxRequest'] - 1
        );
    }

    /**
     * Reduce daily limit.
     * 
     * @param array $data request data
     * 
     * @return void
     */
    protected function reduceHourlyLimit($data)
    {
        if (strtotime(' - ' . $this->config->getHourlyLimit() . ' second ') < $data['period']['hourlyDate']) {
            return $this->config->setHourlyLimit(
                $this->settings['limit']['hourly']['amount'], 
                $data['hourlyMaxRequest'] - 1
            );
        }
        $this->period['hourly'] = array('date' => time(), 'update' => true);
        $this->config->setHourlyLimit(
            $this->settings['limit']['hourly']['amount'], 
            $this->settings['limit']['hourly']['maxRequest'] - 1
        );
    }

    /**
     * Reduce daily limit.
     * 
     * @param array $data request data
     * 
     * @return void
     */
    protected function reduceDailyLimit($data)
    {
        if (strtotime(' - ' . $this->config->getHourlyLimit() . ' second ') < $data['period']['dailyDate']) {
            return $this->config->setDailyLimit(
                $this->settings['limit']['daily']['amount'],
                $data['dailyMaxRequest'] - 1
            );
        }
        $this->period['daily'] = array('date' => time(), 'update' => true);
        $this->config->setDailyLimit(
            $this->settings['limit']['daily']['amount'],
            $this->settings['limit']['daily']['maxRequest'] - 1
        );
    }

    /**
     * Increase limit
     * 
     * @return void
     */
    public function increase()
    {
        $data = $this->getRequestData();
        $this->increaseIntervalLimit($data['intervalMaxRequest']);
        $this->increaseHourlyLimit($data['hourlyMaxRequest']);
        $this->increaseDailyLimit($data['dailyMaxRequest']);
        $this->saveRequest();
    }

    /**
     * Reduce limit.
     * 
     * @return void
     */
    public function reduce()
    {
        // echo 'reduce --------- <br />';
        $data = $this->getRequestData();
        $this->reduceIntervalLimit($data);
        $this->reduceHourlyLimit($data);
        $this->reduceDailyLimit($data);
        $this->saveRequest();
    }

    /**
     * Is allowed.
     * 
     * @return boolean
     */
    public function isAllowed()
    {
        $this->run();  // Read configuration from cache
        if ($this->config->isEnabled() == false) {
            return true;
        }
        if ($this->isBanned()) {
            $this->setError('User is banned.');
            $this->logger->notice(
                'User is banned.', 
                array('channel' => $this->getChannel(), 'identifier' => $this->getIdentifier())
            );
            return false;
        }
        $this->getRequestData();
        // var_dump('after check');
        // echo 'after check --------- <br />';

        if ( ! $this->checkDailyLimit()) {   // Check daily limit is reached
            return false;
        }
        if ( ! $this->checkHourlyLimit()) {
            return false;
        }
        if ( ! $this->checkIntervalLimit()) {
            return false;
        }
        return true;
    }

    /**
     * Check daily limit is reached
     * 
     * @param array $data request data
     * 
     * @return boolean
     */
    public function checkDailyLimit()
    {
        if (strtotime('- ' .$this->config->getDailyLimit().' second') >= $this->data['period']['lastDate']) {
            return true;
        }
        if ($this->data['dailyMaxRequest'] < 1) {
            $this->execBan('Daily');
            return false;
        }
        return true;
    }

    /**
     * Check hourly limit is reached,
     * 
     * @param array $data request data
     * 
     * @return boolean
     */
    public function checkHourlyLimit()
    {
        if (strtotime('- '.$this->config->getHourlyLimit().' second') >= $this->data['period']['lastDate']) {
            return true;
        }
        if ($this->data['hourlyMaxRequest'] < 1) {
            $this->execBan('Hourly');
            return false;
        }
        return true;
    }

    /**
     * Check interval limit is reached
     *
     * @param array $data request data
     * 
     * @return boolean
     */
    public function checkIntervalLimit()
    {
        if (strtotime('- '.$this->config->getIntervalLimit(). ' second') >= $this->data['period']['lastDate']) {
            return true;
        }
        if ($this->data['intervalMaxRequest'] < 1) {
            $this->execBan('Interval');
            return false;
        }
        return true;
    }

    /**
     * Exec Ban
     * 
     * @param string $type type
     * 
     * @return boolean false
     */
    protected function execBan($type)
    {
        if ($this->config->getBanStatus() == true) {
            $this->addBan();
            $this->deleteRequestData();  // Remove request data after ban
            $this->logger->notice(
                ucfirst($type).' ban.', 
                array('channel' => $this->getChannel(), 'identifier' => $this->getIdentifier())
            );
            return;
        }
        $error = 'Maximum connection limit reached for '. $type .' period.';
        $this->setError($error);
        $this->logger->notice(
            $error, 
            array('channel' => $this->getChannel(), 'identifier' => $this->getIdentifier())
        );
    }

    /**
     * Removes request data of valid user
     * 
     * @return boolean
     */
    public function deleteRequestData()
    {
        return $this->cache->delete('Rate:Data:'.$this->getChannel().':'.$this->getIdentifier());
    }

    /**
     * Insert request.
     * 
     * @return void
     */
    protected function saveRequest()
    {
        $time = time();
        $period['period'] = array('lastDate' => $time);

        if ($this->data == false) {  // If request date not empty we update to old request date.
            $period['period']['intervalDate'] = $time;
            $period['period']['hourlyDate'] = $time;
            $period['period']['dailyDate'] = $time;
        } else {
            $period['period']['intervalDate'] = ($this->getPeriod('interval')) ? $time : $this->data['period']['intervalDate'];
            $period['period']['hourlyDate'] = ($this->getPeriod('hourly')) ? $time : $this->data['period']['hourlyDate'];
            $period['period']['dailyDate'] = ($this->getPeriod('daily')) ? $time : $this->data['period']['dailyDate'];
        }
        $data = array(
            'intervalMaxRequest' => $this->config->getIntervalMaxRequest(),
            'hourlyMaxRequest' => $this->config->getHourlyMaxRequest(),
            'dailyMaxRequest' => $this->config->getDailyMaxRequest(),
            'totalRequest'  => $this->config->getTotalRequest() + 1,
            'label' => $this->getLabel(),
        );
        $data = array_merge($data, $period);
        $this->cache->set(
            'Rate:Data:'.$this->getChannel() .':'. $this->getIdentifier(),
            $data,
            static::CONFIG_EXPIRATION
        );
        $this->resetPeriod();    // Period reset
        $this->data = $data;
        // return $data;
    }

    /**
     * Get request data
     * 
     * @return array
     */
    public function getRequestData()
    {
        if (empty($this->data)) {
            $this->saveRequest();
        }
        $this->config->resetLimits();
        $this->config->setIntervalLimit(
            $this->settings['limit']['interval']['amount'], 
            $this->data['intervalMaxRequest']
        );
        $this->config->setHourlyLimit(
            $this->settings['limit']['hourly']['amount'], 
            $this->data['hourlyMaxRequest'],
            true
        );
        $this->config->setDailyLimit(
            $this->settings['limit']['daily']['amount'],
            $this->data['dailyMaxRequest'],
            true
        );
        $this->config->setBanStatus($this->settings['ban']['status']);
        $this->config->setEnable($this->settings['enabled']);
        $this->config->setTotalRequest($this->data['totalRequest']);

        return $this->data;
    }

    /**
     * Add Ban
     * 
     * @return void
     */
    public function addBan()
    {
        $this->cache->set(
            'Rate:Banlist:'.$this->getChannel().':'.$this->getIdentifier(), 
            time(), 
            $this->config->getBanExpiration()
        );
    }

    /**
     * Is banned
     * 
     * @return boolean
     */
    public function isBanned()
    {
        $banlist = $this->cache->get('Rate:Banlist:'. $this->getChannel().':'.$this->getIdentifier());
        if ( ! $banlist) {
            return false;
        }
        return true;
    }

    /**
     * Remove ban
     * 
     * @return void
     */
    public function removeBan()
    {
        $this->cache->delete('Rate:Banlist:'.$this->getChannel().':'.$this->getIdentifier());
    }

}

// END Rate Class

/* End of file Rate.php */
/* Location: .Obullo/Rate/Rate.php */