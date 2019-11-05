<?php

namespace Aziz\ContentBuilderBundle;

use Aziz\ContentBuilderBundle\DependencyInjection\ContentBuilderExtension;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class ContentBuilderBundle extends Bundle
{

    public function getContainerExtension()
    {
        return new ContentBuilderExtension();
    }
}
