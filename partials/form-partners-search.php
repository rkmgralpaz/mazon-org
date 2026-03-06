<?php
$states_names = '
{
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
    "Israel" : "Israel"
}
';
if(isset($_GET['state'])):
    $states_names = json_decode($states_names,true);
    $results = json_decode(file_get_contents('https://mazon.my.salesforce-sites.com/SearchAccountAndRegion/?ServiceType=Account&AccountType=Synagogue&State='.$_GET['state']),true);
    if($results['statusCode'] == 1):
        $html = '';
        if(count($results['accounts'])):
            $html .= '<div>'.count($results['accounts']).' Synagogue Partners found in '.$states_names[$_GET['state']].'</div>';
            foreach($results['accounts'] as $account):
                $html .= '<p>';
                if($account['Website']):
                    if(strpos($account['Website'], 'http') === false):
                        $account['Website'] = 'http://'.$account['Website'];
                    endif;
                    $html .= '<a href="'.$account['Website'].'" target="_blank">'.$account['Name'].'</a><br>';
                else:
                    $html .= '<strong>'.$account['Name'].'</strong><br>';
                endif;
                $html .= '<span class="small">'.$account['BillingCity'].', '.$account['BillingState'].'</span>';
                $html .= '</p>';
            endforeach;
        else:
            $html = 'No results found for '.$states_names[$_GET['state']];
        endif;
        echo $html;
    else:
        echo 'Form error. Please try again.';
    endif;
else:
    echo '';
endif;

/*
//POST EXAMPLE
$query = http_build_query(
    array(
        'reqType' => 'data',
        'newSnapshotName' => 'example',
        'currentSnapshotName' => '1',
        'configId' => '2',
        'ttData' => '4',
        'feData' => '5'
    )
);
$options = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded'
    )
);
file_get_contents('http://server.com/myfile.php?' . $query, false, stream_context_create($options));
*/

?>