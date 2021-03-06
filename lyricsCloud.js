
    // stopwords provided by python NLTK package
const stop_words = new Set(['off', 'himself', 'o', 'they', 'before', 'other', 'the', 'her', 'had', 'but', 'not', 'are', 'further', 'once', 'until', 'myself', 'a', 'hasn', 'hers', 'both', 'aren', 'will', 'why', 'wasn', 'theirs', "you've", 'than', 'doesn', 'ma', 'no', "aren't", 'against', 'were', 'what', 'be', 'who', 'that', 'own', "that'll", 'doing', 'after', 've', 'these', 'of', 'there', "didn't", 'yourselves', 'nor', 'you', 'over', "you're", 'between', 't', 'which', 'themselves', 'did', 'herself', 'only', 'haven', 'we', 'whom', "you'll", "don't", "wouldn't", 'needn', 'm', 'this', 'then', "it's", "mightn't", 'ain', "mustn't", 'their', 'from', 's', 'on', 'll', 'couldn', 'as', 'ourselves', 'with', 'when', 'most', 'by', 'if', 'should', "isn't", 'me', 'my', "she's", 'very', 'because', 'mightn', 'all', 'its', 'again', 'y', 'have', 'being', 'him', 'so', 'didn', 'here', 'shan', 'is', 'ours', 'them', 'where', 'was', 'through', 'under', 'do', 'can', "haven't", 'been', 'into', 'same', 'his', 'don', 'to', 'our', 'it', 'shouldn', 'down', 'd', 'in', 'does', 'about', 'weren', 'such', 'she', 'too', 'those', 'below', "hasn't", 'wouldn', 'more', 'above', 'while', 'how', 'each', 'he', "wasn't", "shouldn't", 'up', "needn't", 'some', "couldn't", 'hadn', 'out', 'am', 'few', 'has', "shan't", "hadn't", 'yourself', "doesn't", 'i', "should've", 'mustn', 'your', 'isn', 'at', 'just', "you'd", "weren't", 'won', 'or', 'and', 'now', 'for', 're', 'yours', 'an', 'any', "won't", 'during', 'itself', 'having']);

//var fill = d3.scale.category20();

function LyricsCloud(id, paragraph, options){
    var cfg = {
        width: 800,
        height: 600,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        color: ["#f58f7c","#7cf5c2","#f5cc7c","#857cf5"],
        num_words_max: 50
    };
    
//    Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}
    
    // Using any non letter or number character as delimiter
    var tokens = paragraph.split(/\W+/);
    var wordFreq_dict = {};

    
//    count word frequency
    for (var i = 0; i < tokens.length; i++) {
      var word = tokens[i];
      if (wordFreq_dict[word] === undefined) {
        wordFreq_dict[word] = 1;
      } else {
        wordFreq_dict[word]++;
      }
    }
    
    var wordFreq_array = [];
    for (var word in wordFreq_dict) {
        wordFreq_array.push([word, wordFreq_dict[word]]);
    }
    wordFreq_array.sort(function(a, b) {
        return -a[1] + b[1];});
    
//    map appearance frequency to fontsize in word cloud
    var lyrics_data = [];
    var num_words_count = 0;
    for (var i=0; i<wordFreq_array.length; i++) {
        var word = wordFreq_array[i][0];
        if ( !stop_words.has(word) && num_words_count<cfg.num_words_max ){
            var temp = {word: word,
                       size: freq2size_helper(wordFreq_dict[word])};
            lyrics_data.push(temp);
            num_words_count++;
        }
    }    
    
    // helper function: word frequency to fontsize 
    // linear transformation: max fontsize = 150, min fontsize = 15
    function freq2size_helper(freq){
        var word_freq_values = Object.values(wordFreq_dict);
        var word_freq_max = Math.max(...word_freq_values);
        var word_freq_min = Math.min(...word_freq_values);
        var word_freq_range = word_freq_max-word_freq_min;
        var freq2size_ratio = (150-15)/word_freq_range;
        return (freq - word_freq_min)*freq2size_ratio+20
    };
    
    
    
    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", cfg.width + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    var layout = d3.layout
        .cloud()
      .size([cfg.width, cfg.height])
      .words(lyrics_data.map(function(d) { return {text: d.word, size:d.size}; }))
      .padding(10)        //space between words
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .fontSize(function(d) { return d.size; })      // font size of words
      .on("end", draw);

    layout.start();

    // This function takes the output of 'layout' above and draw the words
    function draw(words) {
      svg
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", function(d, i) { return cfg.color[i%cfg.color.length]})
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}

