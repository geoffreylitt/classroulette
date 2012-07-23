class Course < ActiveRecord::Base

  def category
    category_name = ""

    arts = {:name => 'arts', :departments => ['ARCH','ART','CPAR','DRAM','DRST','FILM','MUSI','THST']}
    lang = {:name => 'lang', :departments => ['AKKD','ARBC','BNGL','CHNS','CSBK','CSBR','CSCC','CSDC','CSES','CSJE','CSMC','CSPC','CSSM','CSSY','CSTC','CSTD','CSYC','CZEC','DUTC','FREN','GMAN','GREK','HEBR','HNDI','INDN','ITAL','JAPN','KREN','LATN','MGRK','NAVY','PERS','PLSH','PORT','RUSS','SKRT','SLAV','SPAN','SPEC','SWAH','TAML','TKSH','USAF','VIET','YORU','ZULU']}
    sosc = {:name => 'sosc', :departments => ['ACCT','ANTH','CGSC','CHLD','ECON','EDST','EGYP','ENVE','F&ES','HLTH','LING','MGT','PLSC','PSYC','SOCY','STCY']}
    hums = {:name => 'hums', :departments => ['AFAM','AFST','AMST','ARCG','CLCV','CLSS','EALL','EAST','ENGL','EP&E','ER&M','GLBL','GMST','HIST','HSAR','HSHM','HUMS','JDST','LAST','LITR','MMES','NELC','PHIL','RLST','RSEE','SAST','WGSS']}
    sci = {:name => 'sci', :departments => ['AMTH','APHY','ASTR','BENG','BIOL','CENG','CHEM','CPSC','E&EB','EENG','ENAS','EVST','G&G','MATH','MB&B','MCDB','MENG','OPRS','PHYS','SCIE','STAT']}

    [arts, lang, sosc, hums, sci].each do |category_hash|
      if category_hash[:departments].include? self.department
        category_name = category_hash[:name]
      end
    end

    if category_name.nil?
      category_name = 'other'
    end

    category_name
  end
end