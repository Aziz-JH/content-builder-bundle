<?php

namespace Aziz\ContentBuilderBundle\EventListener;

class System
{
    public function onInitializeSystem()
    {
        if (\Contao\System::getContainer()->get('contao.security.token_checker')->hasBackendUser()) {
            $script = './bundles/contentbuilder/js/content_builder.js';
            $GLOBALS['TL_BODY'][] = "<script src='$script' async></script>";
        }
    }
}
