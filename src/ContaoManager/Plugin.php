<?php

/**
 * Extension for Contao 4
 *
 * @copyright  Julian Haslinger 2019
 * @author     Julian Haslinger <me@aziz.wtf>
 * @package    content-builder-bundle
 * @licence    LGPL
 * @see        https://github.com/azizJH/content-builder-bundle
 */

namespace Aziz\ContentBuilderBundle\ContaoManager;

use Aziz\ContentBuilderBundle\ContentBuilderBundle;
use Contao\ManagerPlugin\Bundle\Config\BundleConfig;
use Contao\ManagerPlugin\Bundle\BundlePluginInterface;
use Contao\ManagerPlugin\Bundle\Parser\ParserInterface;

/**
 * Plugin for the Contao Manager.
 *
 * @author Softleister
 */
class Plugin implements BundlePluginInterface
{
    /**
     * {@inheritdoc}
     */
    public function getBundles(ParserInterface $parser)
    {
        $loadAfter = [
            // core
            Contao\CoreBundle\ContaoCoreBundle::class,
        ];

        return [
            BundleConfig::create(ContentBuilderBundle::class)
                        ->setLoadAfter($loadAfter)
        ];
    }
}
