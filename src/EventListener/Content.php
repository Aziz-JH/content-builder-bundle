<?php

namespace Aziz\ContentBuilderBundle\EventListener;

use Contao\Backend;
use Contao\CoreBundle\Security\Authentication\Token\TokenChecker;
use Symfony\Cmf\Component\Routing\ChainRouter;

class Content
{
    /**
     * Content constructor.
     *
     * @param ChainRouter $router
     * @param TokenChecker $tokenChecker
     */
    public function __construct(ChainRouter $router, TokenChecker $tokenChecker)
    {
        $this->router = $router;
        $this->tokenChecker = $tokenChecker;
    }

    /**
     * Set css classes for tl_content
     *
     * @uses TL_HOOKS getContentElement
     *
     * @param $row
     * @param $content
     * @param $objElement
     *
     * @return string
     */
    public function onGetContentElement($row, $content, $objElement)
    {
        if ($this->tokenChecker->hasBackendUser()) {
            return $content;
        }
        $table = $objElement->ptable;
        $bdMod = [];
        foreach ($GLOBALS['BE_MOD'] as $cat) {
            $bdMod = array_merge($bdMod, $cat);
        }

        $mod = array_key_first(array_filter($bdMod, function ($mod) use ($table) {
            return is_array($mod['tables']) && in_array($table, $mod['tables']);
        }));

        if (!$mod) {
            return $content;
        }

        $newQuery = parse_url(Backend::addToUrl(http_build_query([
            'do' => $mod,
            'table' => 'tl_content',
            'id' => '1',
            'act' => 'create',
            'mode' => '1',
            'pid' => $objElement->id,
            'popup' => '1',
            'nb' => '1',
        ])))['query'];

        $editQuery = parse_url(Backend::addToUrl(http_build_query([
            'do' => $mod,
            'table' => 'tl_content',
            'id' => $objElement->id,
            'act' => 'edit',
            'popup' => '1',
            'nb' => '1',
        ])))['query'];

        $backendPath = $this->router->generate('contao_backend');

        $title = $GLOBALS['TL_LANG']['CTE']['alias'][0] . ' ID ' . $objElement->id .
                 ' ' . strtolower($GLOBALS['TL_LANG']['MSC']['editSelected']);

        $config = json_encode([
            'id' => $objElement->id,
            'sort' => $objElement->sorting,
            'edit' => [
                'title' => $title,
                'url' => $backendPath . '/?' . $editQuery,
            ],
            'create' => $backendPath . '/?' . $newQuery,
        ]);

        return preg_replace_callback('(<([a-zA-Z]+).*?>)is', function ($treffer) use ($config) {
            return str_replace($treffer[1], $treffer[1] . " data-azizoverlay='$config'", $treffer[0]);
        }, $content, 1);
    }
}
